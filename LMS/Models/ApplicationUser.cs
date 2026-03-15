using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace LMS.Models {
    public class ApplicationUser : IdentityUser<int> {
        [MaxLength(30)]
        public string Name { get; set; } = string.Empty;
    }
}
