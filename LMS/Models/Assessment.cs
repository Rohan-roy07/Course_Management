using System.ComponentModel.DataAnnotations;

namespace LMS.Models {
    public class Assessment {
        [Key] 
        public int AssessmentId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        public int CourseId { get; set; }
    }
}
