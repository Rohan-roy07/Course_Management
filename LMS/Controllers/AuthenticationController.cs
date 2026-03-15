using LMS;
using LMS.Models;
using LMS.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthenticationController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginModel model)
        {
            var (status, result) = await _authService.Login(model);
            if (status == 1) return Ok(result);
            return Unauthorized(new { message = result });
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(User model) {
            // log incoming payload
            Console.WriteLine("Register payload: " + System.Text.Json.JsonSerializer.Serialize(model));

            if (!ModelState.IsValid)
            {
                Console.WriteLine("ModelState invalid: " +
                                  System.Text.Json.JsonSerializer.Serialize(ModelState
                                      .Where(kvp => kvp.Value.Errors.Any())
                                      .ToDictionary(kvp => kvp.Key, kvp => kvp.Value.Errors.Select(e => e.ErrorMessage))));
                // return validation failures for easier debugging on the client
                return BadRequest(ModelState);
            }

            var (status, message) = await _authService.Register(model, model.UserRole);
            if (status == 1) return Ok(new { message });
            return BadRequest(new { message });
        }
    }
}
