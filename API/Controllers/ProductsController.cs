using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastucture.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<Product> _productRepo;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IGenericRepository<ProductBrand> _productBrandsRepo;
        private readonly IMapper _mapper;

        public ProductsController(IGenericRepository<Product> productRepo,
                                  IGenericRepository<ProductType> productTypeRepo,
                                  IGenericRepository<ProductBrand> productBrandsRepo,
                                  IMapper mapper)
        {
            _productBrandsRepo = productBrandsRepo;
            _mapper = mapper;
            _productTypeRepo = productTypeRepo;
            _productRepo = productRepo;
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<ProductsToReturnDTO>>> GetProducts([FromQuery]ProductSpecParams productSpec)
        {
            var spec = new ProductsWithBrandsAndTypesSpecification(productSpec);
            var countSpec = new ProductWithFiltersForCountSpecification(productSpec);
            var totalItems = await _productRepo.CountAsync(countSpec);
            var products = await _productRepo.ListWithSpecAsync(spec);
            var data = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductsToReturnDTO>>(products);


            return Ok(new Pagination<ProductsToReturnDTO>(productSpec.PageIndex, productSpec.PageSize, totalItems, data));
        }

        [HttpGet("{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductsToReturnDTO>> GetProduct(int Id)
        {
            var spec = new ProductsWithBrandsAndTypesSpecification(Id);
            var product = await _productRepo.GetEntityWithSpecAsync(spec);

            if(product == null)
                return NotFound(new ApiResponse(404));

            return _mapper.Map<Product, ProductsToReturnDTO>(product);
        }

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            return Ok(await _productTypeRepo.ListAllAsync());
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            return Ok(await _productBrandsRepo.ListAllAsync());
        }
    }
}