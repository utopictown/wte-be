import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WarrantyClaimsService } from './warranty-claims.service';
import { CreateWarrantyClaimDto } from './dto/create-warranty-claim.dto';
import { UpdateWarrantyClaimDto } from './dto/update-warranty-claim.dto';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/users/schemas/user.schema';

@Controller('warranty-claims')
export class WarrantyClaimsController {
  constructor(private readonly warrantyClaimsService: WarrantyClaimsService) {}

  @Post()
  create(@Body() createWarrantyClaimDto: CreateWarrantyClaimDto) {
    return this.warrantyClaimsService.create(createWarrantyClaimDto);
  }

  @Get('mine')
  findAllMine() {
    return this.warrantyClaimsService.findAllMine();
  }

  @Get('mine/:id')
  findOneMine(@Param('id') id: string) {
    return this.warrantyClaimsService.findOneMine(id);
  }

  @Get()
  @Roles(Role.Staff)
  findAll() {
    return this.warrantyClaimsService.findAll();
  }

  @Get(':id')
  @Roles(Role.Staff)
  findOne(@Param('id') id: string) {
    return this.warrantyClaimsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Staff)
  update(@Param('id') id: string, @Body() updateWarrantyClaimDto: UpdateWarrantyClaimDto) {
    return this.warrantyClaimsService.update(id, updateWarrantyClaimDto);
  }

  @Delete(':id')
  @Roles(Role.Staff)
  remove(@Param('id') id: string) {
    return this.warrantyClaimsService.remove(id);
  }
}
