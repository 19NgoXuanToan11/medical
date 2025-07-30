using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace API.Swagger;

public class FileUploadOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var fileParameters = context.ApiDescription.ParameterDescriptions.Where(x =>
            x.ModelMetadata?.ModelType == typeof(IFormFile)
        );

        foreach (var parameter in fileParameters)
        {
            var content = new Dictionary<string, OpenApiMediaType>
            {
                ["multipart/form-data"] = new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Properties = new Dictionary<string, OpenApiSchema>
                        {
                            ["file"] = new OpenApiSchema { Type = "string", Format = "binary" },
                        },
                    },
                },
            };

            operation.RequestBody = new OpenApiRequestBody { Content = content };

            // Remove the parameter from the operation parameters
            operation.Parameters = operation
                .Parameters.Where(p => p.Name != parameter.Name)
                .ToList();
        }
    }
}
