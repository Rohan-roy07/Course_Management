using System.ComponentModel.DataAnnotations;

namespace LMS.Models {
    public class Lesson {
        [Key] 
        public int LessonId { get; set; }
        public string Title { get; set; } = string.Empty;
        // kept for backwards compatibility but new code uses LinkUrl
        public string ContentUrl { get; set; } = string.Empty;
        public string LinkUrl { get; set; } = string.Empty;        // optional external link
        public string Notes { get; set; } = string.Empty;          // teacher notes/text
        public string FileUrl { get; set; } = string.Empty;        // uploaded file path
        public string VideoUrl { get; set; } = string.Empty;       // uploaded video path
        public int CourseId { get; set; }
    }
}
