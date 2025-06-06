using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using AutoMapper;
using DB;
using Service;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RequestResultController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IRequestResultService _requestResultService;

    public RequestResultController(IMapper mapper, IRequestResultService requestResultService)
    {
        _mapper = mapper;
        _requestResultService = requestResultService;
    }

    // GET: api/RequestResult
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RequestResultDto.ViewModel>>> GetRequestResults()
    {
        var requestResults = await _requestResultService.GetAllRequestResultsAsync();
        var viewModels = _mapper.Map<IEnumerable<RequestResultDto.ViewModel>>(requestResults);
        return Ok(viewModels);
    }

    // GET: api/RequestResult/5
    [HttpGet("{id}")]
    public async Task<ActionResult<RequestResultDto.ViewModel>> GetRequestResult(int id)
    {
        var requestResult = await _requestResultService.GetRequestResultByIdAsync(id);
        if (requestResult == null)
        {
            return NotFound();
        }
        var viewModel = _mapper.Map<RequestResultDto.ViewModel>(requestResult);
        return Ok(viewModel);
    }

    // GET: api/RequestResult/request/5
    [HttpGet("request/{requestId}")]
    public async Task<ActionResult<IEnumerable<RequestResultDto.ViewModel>>> GetRequestResultsByRequest(int requestId)
    {
        var requestResults = await _requestResultService.GetRequestResultsByRequestIdAsync(requestId);
        var viewModels = _mapper.Map<IEnumerable<RequestResultDto.ViewModel>>(requestResults);
        return Ok(viewModels);
    }

    // GET: api/RequestResult/request/5/latest
    [HttpGet("request/{requestId}/latest")]
    public async Task<ActionResult<RequestResultDto.ViewModel>> GetLatestRequestResult(int requestId)
    {
        var requestResult = await _requestResultService.GetLatestRequestResultByRequestIdAsync(requestId);
        if (requestResult == null)
        {
            return NotFound();
        }
        var viewModel = _mapper.Map<RequestResultDto.ViewModel>(requestResult);
        return Ok(viewModel);
    }

    // GET: api/RequestResult/status/completed
    [HttpGet("status/{status}")]
    public async Task<ActionResult<IEnumerable<RequestResultDto.ViewModel>>> GetRequestResultsByStatus(string status)
    {
        var requestResults = await _requestResultService.GetRequestResultsByStatusAsync(status);
        var viewModels = _mapper.Map<IEnumerable<RequestResultDto.ViewModel>>(requestResults);
        return Ok(viewModels);
    }

    // POST: api/RequestResult
    [HttpPost]
    public async Task<ActionResult<RequestResultDto.ViewModel>> CreateRequestResult(RequestResultDto.Create createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var requestResult = _mapper.Map<RequestResult>(createDto);
        var created = await _requestResultService.CreateRequestResultAsync(requestResult);
        if (created == null)
        {
            return BadRequest("Failed to create request result.");
        }
        var viewModel = _mapper.Map<RequestResultDto.ViewModel>(created);
        return CreatedAtAction(nameof(GetRequestResult), new { id = viewModel.ResultId }, viewModel);
    }

    // PUT: api/RequestResult/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRequestResult(int id, RequestResultDto.Update updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var requestResult = _mapper.Map<RequestResult>(updateDto);
        requestResult.ResultId = id;
        var success = await _requestResultService.UpdateRequestResultAsync(requestResult);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    // DELETE: api/RequestResult/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRequestResult(int id)
    {
        var success = await _requestResultService.DeleteRequestResultAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
} 