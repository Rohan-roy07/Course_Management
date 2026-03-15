using LMS;

namespace LMS.Services
{
    public interface IAuthService
    {
        Task<(int, string)> Register(User model, string role);
        Task<(int, object)> Login(LoginModel model);
    }
}
