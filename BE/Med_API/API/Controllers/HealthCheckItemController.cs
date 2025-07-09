using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Service;
using DB;
using API.DTOs;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthCheckItemController : ControllerBase
{
    private readonly IHealthCheckItemService _healthCheckItemService;
    private readonly IMapper _mapper;

    public HealthCheckItemController(IHealthCheckItemService healthCheckItemService, IMapper mapper)
    {
        _healthCheckItemService = healthCheckItemService;
        _mapper = mapper;
    }

    /// <summary>
    /// Lấy tất cả hạng mục khám
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<HealthCheckItemDto.ListViewModel>>> GetAllHealthCheckItems()
    {
        try
        {
            var healthCheckItems = await _healthCheckItemService.GetAllHealthCheckItemsAsync();
            var result = _mapper.Map<IEnumerable<HealthCheckItemDto.ListViewModel>>(healthCheckItems);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi lấy danh sách hạng mục khám", error = ex.Message });
        }
    }

    /// <summary>
    /// Lấy tất cả hạng mục khám đang hoạt động
    /// </summary>
    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<HealthCheckItemDto.ListViewModel>>> GetActiveHealthCheckItems()
    {
        try
        {
            var healthCheckItems = await _healthCheckItemService.GetActiveHealthCheckItemsAsync();
            var result = _mapper.Map<IEnumerable<HealthCheckItemDto.ListViewModel>>(healthCheckItems);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi lấy danh sách hạng mục khám hoạt động", error = ex.Message });
        }
    }

    /// <summary>
    /// Lấy hạng mục khám theo ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<HealthCheckItemDto.ViewModel>> GetHealthCheckItemById(int id)
    {
        try
        {
            var healthCheckItem = await _healthCheckItemService.GetHealthCheckItemWithMedicalSuppliesAsync(id);
            if (healthCheckItem == null)
            {
                return NotFound(new { message = "Không tìm thấy hạng mục khám" });
            }

            var result = _mapper.Map<HealthCheckItemDto.ViewModel>(healthCheckItem);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi lấy thông tin hạng mục khám", error = ex.Message });
        }
    }

    /// <summary>
    /// Lấy hạng mục khám theo danh mục
    /// </summary>
    [HttpGet("category/{category}")]
    public async Task<ActionResult<IEnumerable<HealthCheckItemDto.ListViewModel>>> GetHealthCheckItemsByCategory(string category)
    {
        try
        {
            var healthCheckItems = await _healthCheckItemService.GetHealthCheckItemsByCategoryAsync(category);
            var result = _mapper.Map<IEnumerable<HealthCheckItemDto.ListViewModel>>(healthCheckItems);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi lấy hạng mục khám theo danh mục", error = ex.Message });
        }
    }

    /// <summary>
    /// Lấy tất cả danh mục hạng mục khám
    /// </summary>
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetAllCategories()
    {
        try
        {
            var categories = await _healthCheckItemService.GetAllCategoriesAsync();
            return Ok(categories);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi lấy danh sách danh mục", error = ex.Message });
        }
    }

    /// <summary>
    /// Lấy hạng mục khám với thông tin vật tư y tế
    /// </summary>
    [HttpGet("with-medical-supplies")]
    public async Task<ActionResult<IEnumerable<HealthCheckItemDto.ViewModel>>> GetHealthCheckItemsWithMedicalSupplies()
    {
        try
        {
            var healthCheckItems = await _healthCheckItemService.GetHealthCheckItemsWithMedicalSuppliesAsync();
            var result = _mapper.Map<IEnumerable<HealthCheckItemDto.ViewModel>>(healthCheckItems);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi lấy hạng mục khám với vật tư y tế", error = ex.Message });
        }
    }

    /// <summary>
    /// Tạo hạng mục khám mới
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<HealthCheckItemDto.ViewModel>> CreateHealthCheckItem([FromBody] HealthCheckItemDto.Create createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if code already exists
            var codeExists = await _healthCheckItemService.CodeExistsAsync(createDto.Code);
            if (codeExists)
            {
                return BadRequest(new { message = "Mã hạng mục khám đã tồn tại" });
            }

            var healthCheckItem = _mapper.Map<HealthCheckItem>(createDto);
            var result = await _healthCheckItemService.CreateHealthCheckItemAsync(healthCheckItem);

            if (result == null)
            {
                return BadRequest(new { message = "Không thể tạo hạng mục khám. Vui lòng kiểm tra lại thông tin." });
            }

            // Get the created item with medical supplies
            var createdItem = await _healthCheckItemService.GetHealthCheckItemWithMedicalSuppliesAsync(result.ItemId);
            var viewModel = _mapper.Map<HealthCheckItemDto.ViewModel>(createdItem);

            return CreatedAtAction(nameof(GetHealthCheckItemById), new { id = result.ItemId }, viewModel);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi tạo hạng mục khám", error = ex.Message });
        }
    }

    /// <summary>
    /// Cập nhật hạng mục khám
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<HealthCheckItemDto.ViewModel>> UpdateHealthCheckItem(int id, [FromBody] HealthCheckItemDto.Update updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if code already exists (excluding current item)
            if (!string.IsNullOrEmpty(updateDto.Code))
            {
                var codeExists = await _healthCheckItemService.CodeExistsAsync(updateDto.Code, id);
                if (codeExists)
                {
                    return BadRequest(new { message = "Mã hạng mục khám đã tồn tại" });
                }
            }

            var healthCheckItem = _mapper.Map<HealthCheckItem>(updateDto);
            var result = await _healthCheckItemService.UpdateHealthCheckItemAsync(id, healthCheckItem);

            if (result == null)
            {
                return NotFound(new { message = "Không tìm thấy hạng mục khám để cập nhật" });
            }

            // Update medical supplies if provided
            if (updateDto.RequiredMedicalSupplies != null)
            {
                var medicalSupplies = _mapper.Map<List<HealthCheckItemMedicalSupply>>(updateDto.RequiredMedicalSupplies);
                var updateSuccess = await _healthCheckItemService.UpdateHealthCheckItemMedicalSuppliesAsync(id, medicalSupplies);
                
                if (!updateSuccess)
                {
                    return BadRequest(new { message = "Không thể cập nhật vật tư y tế cho hạng mục khám" });
                }
            }

            // Get updated item with medical supplies
            var updatedItem = await _healthCheckItemService.GetHealthCheckItemWithMedicalSuppliesAsync(id);
            var viewModel = _mapper.Map<HealthCheckItemDto.ViewModel>(updatedItem);

            return Ok(viewModel);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi cập nhật hạng mục khám", error = ex.Message });
        }
    }

    /// <summary>
    /// Xóa hạng mục khám
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteHealthCheckItem(int id)
    {
        try
        {
            var result = await _healthCheckItemService.DeleteHealthCheckItemAsync(id);
            if (!result)
            {
                return NotFound(new { message = "Không tìm thấy hạng mục khám để xóa" });
            }

            return Ok(new { message = "Xóa hạng mục khám thành công" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi xóa hạng mục khám", error = ex.Message });
        }
    }

    /// <summary>
    /// Cập nhật vật tư y tế cho hạng mục khám
    /// </summary>
    [HttpPut("{id}/medical-supplies")]
    public async Task<ActionResult> UpdateHealthCheckItemMedicalSupplies(int id, [FromBody] List<HealthCheckItemDto.MedicalSupplyRequirementCreate> medicalSupplies)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var healthCheckItemExists = await _healthCheckItemService.GetHealthCheckItemByIdAsync(id);
            if (healthCheckItemExists == null)
            {
                return NotFound(new { message = "Không tìm thấy hạng mục khám" });
            }

            var medicalSupplyEntities = _mapper.Map<List<HealthCheckItemMedicalSupply>>(medicalSupplies);
            var result = await _healthCheckItemService.UpdateHealthCheckItemMedicalSuppliesAsync(id, medicalSupplyEntities);

            if (!result)
            {
                return BadRequest(new { message = "Không thể cập nhật vật tư y tế cho hạng mục khám" });
            }

            return Ok(new { message = "Cập nhật vật tư y tế thành công" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi cập nhật vật tư y tế", error = ex.Message });
        }
    }

    /// <summary>
    /// Kiểm tra mã hạng mục khám có tồn tại không
    /// </summary>
    [HttpGet("check-code/{code}")]
    public async Task<ActionResult<bool>> CheckCodeExists(string code, [FromQuery] int? excludeId = null)
    {
        try
        {
            var exists = await _healthCheckItemService.CodeExistsAsync(code, excludeId);
            return Ok(new { exists });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi kiểm tra mã hạng mục khám", error = ex.Message });
        }
    }
} 