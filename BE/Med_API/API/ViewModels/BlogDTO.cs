using System;

namespace API.ViewModels;

public class BlogDTO
{
    public int BlogId { get; set; }
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string? Summary { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public string? Category { get; set; }
    public string? Status { get; set; }
    public string? StaffUsername { get; set; }
} 