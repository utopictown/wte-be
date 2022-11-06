import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WarrantyClaimsService } from './warranty-claims.service';
import { CreateWarrantyClaimDto } from './dto/create-warranty-claim.dto';
import { UpdateWarrantyClaimDto } from './dto/update-warranty-claim.dto';

@Controller('warranty-claims')
export class WarrantyClaimsController {
  constructor(private readonly warrantyClaimsService: WarrantyClaimsService) {}

  @Post()
  create(@Body() createWarrantyClaimDto: CreateWarrantyClaimDto) {
    return this.warrantyClaimsService.create(createWarrantyClaimDto);
  }

  @Get()
  findAll() {
    return this.warrantyClaimsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warrantyClaimsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWarrantyClaimDto: UpdateWarrantyClaimDto) {
    return this.warrantyClaimsService.update(+id, updateWarrantyClaimDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warrantyClaimsService.remove(+id);
  }
}
