using System.ComponentModel.DataAnnotations;

namespace LMS
{
    public class User
    {
        // PK identity column
        public int UserId { get; set; }

        // foreign key to AspNetUsers.Id
        public int IdentityId { get; set; }

        [Required] 
        public string Username { get; set; } = string.Empty;
        [Required, EmailAddress] 
        public string Email { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        [Required] 
        public string Password { get; set; } = string.Empty;
        [Required] 
        public string UserRole { get; set; } = string.Empty;
        public bool IsApproved { get; set; } = false;
    }
}

