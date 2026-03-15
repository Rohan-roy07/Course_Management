namespace LMS.Models
{
    public class Grade
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int AssessmentId { get; set; }
        public double Score { get; set; }
    }
}
