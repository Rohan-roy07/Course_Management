using System.ComponentModel.DataAnnotations;

namespace LMS.Models {
    public class Course {
        [Key] 
        public int CourseId { get; set; }
        [Required] 
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int TeacherId { get; set; }
    }
}
