using Audiarr.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Audiarr.Api.Data;

public class AudiarrDb : DbContext
{
    public AudiarrDb(DbContextOptions<AudiarrDb> opts) : base(opts) { }

    public DbSet<Audiobook> Audiobooks { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Audiobook>().HasKey(a => a.Id);
    }
}
