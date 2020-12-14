using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "Bob",
                    Email = "Bob@test.com",
                    UserName = "Bob@test.com",
                    Address = new Address
                    {
                        FirstName = "Bob",
                        LasttName = "Anderson",
                        Street = "10th",
                        City = "New York",
                        State = "NY",
                        ZipCode = "123456"
                    }
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
            }

        }
    }
}
