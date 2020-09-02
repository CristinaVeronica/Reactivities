using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
         //save the result from our photo upload
         PhotoUploadResult AddPhoto(IFormFile file);
         string DeletePhoto(string publicId);
    }
}