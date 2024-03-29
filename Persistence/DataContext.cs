using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) :
            base(options)
        {
        }

        //this will be used for tabel name inside sqlite
        public DbSet<Value> Values { get; set; }

        public DbSet<Activity> Activities { get; set; }

        public DbSet<UserActivity> UserActivities { get; set; }

        public DbSet<Photo> Photos { get; set; }

        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            //this allows us when creating a migration to give our appUser a primary key as a string

            base.OnModelCreating(builder);

            builder
                .Entity<Value>()
                .HasData(new Value { Id = 1, Name = "Value 101" },
                new Value { Id = 2, Name = "Value 102" },
                new Value { Id = 3, Name = "Value 103" });

            //create primary key for UserActivities
            builder
                .Entity<UserActivity>(x =>
                    x.HasKey(ua => new { ua.AppUserId, ua.ActivityId }));

            //define the relationship
            builder
                .Entity<UserActivity>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserActivities)
                .HasForeignKey(u => u.AppUserId);

            builder
                .Entity<UserActivity>()
                .HasOne(a => a.Activity)
                .WithMany(u => u.UserActivities)
                .HasForeignKey(u => u.ActivityId);
        }
    }
}
