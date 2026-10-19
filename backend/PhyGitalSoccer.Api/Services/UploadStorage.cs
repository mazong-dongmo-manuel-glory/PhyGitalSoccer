namespace PhyGitalSoccer.Api.Services;

public record StoredUpload(string FileName, string Type);

/// <summary>
/// Stores admin-uploaded media on disk (served under <see cref="RequestPath"/>).
/// Files are identified by their content signature, never by the client-supplied name or MIME type.
/// </summary>
public class UploadStorage
{
    public const string RequestPath = "/uploads";
    public const long MaxImageBytes = 15 * 1024 * 1024;
    public const long MaxVideoBytes = 200 * 1024 * 1024;

    private record Format(string Extension, string Type, Func<byte[], bool> Matches);

    private static readonly Format[] Formats =
    [
        new(".jpg", "image", h => h is [0xFF, 0xD8, 0xFF, ..]),
        new(".png", "image", h => h is [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, ..]),
        new(".gif", "image", h => h is [(byte)'G', (byte)'I', (byte)'F', (byte)'8', ..]),
        new(".webp", "image", h => h.Length >= 12 && Ascii(h, 0, "RIFF") && Ascii(h, 8, "WEBP")),
        new(".mp4", "video", h => h.Length >= 12 && Ascii(h, 4, "ftyp")),
        new(".webm", "video", h => h is [0x1A, 0x45, 0xDF, 0xA3, ..]),
    ];

    public string Directory { get; }

    public UploadStorage(IWebHostEnvironment env)
    {
        Directory = Path.Combine(env.ContentRootPath, "wwwroot", "uploads");
        System.IO.Directory.CreateDirectory(Directory);
    }

    /// <exception cref="InvalidDataException">Unsupported format or file too large.</exception>
    public async Task<StoredUpload> SaveAsync(IFormFile file, CancellationToken ct)
    {
        var header = new byte[16];
        int read;
        await using (var probe = file.OpenReadStream())
        {
            read = await probe.ReadAtLeastAsync(header, header.Length, throwOnEndOfStream: false, ct);
        }

        var format = Formats.FirstOrDefault(f => f.Matches(header[..read]))
            ?? throw new InvalidDataException("Format non supporté. Formats acceptés : JPG, PNG, WEBP, GIF, MP4, WEBM.");

        var limit = format.Type == "video" ? MaxVideoBytes : MaxImageBytes;
        if (file.Length > limit)
            throw new InvalidDataException($"Fichier trop volumineux (max {limit / (1024 * 1024)} Mo pour ce type).");

        var fileName = $"{Guid.NewGuid():N}{format.Extension}";
        await using (var target = File.Create(Path.Combine(Directory, fileName)))
        {
            await file.CopyToAsync(target, ct);
        }
        return new StoredUpload(fileName, format.Type);
    }

    /// <summary>Deletes the file behind a URL previously returned for an upload; ignores any other URL.</summary>
    public void TryDelete(string? url)
    {
        if (string.IsNullOrEmpty(url) || !Uri.TryCreate(url, UriKind.RelativeOrAbsolute, out var uri)) return;
        var path = uri.IsAbsoluteUri ? uri.AbsolutePath : url;
        if (!path.StartsWith(RequestPath + "/", StringComparison.Ordinal)) return;

        var fileName = Path.GetFileName(path);
        if (fileName != path[(RequestPath.Length + 1)..]) return;

        var fullPath = Path.Combine(Directory, fileName);
        if (File.Exists(fullPath)) File.Delete(fullPath);
    }

    private static bool Ascii(byte[] h, int offset, string s)
    {
        for (var i = 0; i < s.Length; i++)
            if (h[offset + i] != s[i]) return false;
        return true;
    }
}
