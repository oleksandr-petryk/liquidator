import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SessionDto {
  @ApiProperty({
    description: 'Refresh token',
    type: String,
    example:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEyZDQ2YmI5LWM0ZjMtNDEzMy1iZjg3LTFhNmI0MjM2ZWU2MiIsImlhdCI6MTc0ODcxMDIyMiwiZXhwIjoxNzQ4NzExMTIyfQ.fGa4NiZ2YmPWTz6p1pDbOXSo7FxQ-bl5gVQFFWRdu8wklASJMjM5MjDzvIjkvObWdQvBMBLEh7subKIYph-kGnd0zVmE868cgWXGVYbhaZDVCAQ_mEvQM6d168x_69Vh0VxHVQehDsaNXeZibChvVMq4NLuWhQHgMN57512qB4MoPVesuM8smHiJMeDyh08wfDFyFx1p4VAT9_NKcTNQh2ioM1NpgQ_e_KcXLuUxdmEwxvdphFQrhy5oqS9599cHj4Z6klhqmr6VuBJyAhQbLKB-iNbmOPoxRmAhIsPT3d61f47nMSVsttkWEo--eC-uj1vCppytC005xiIJVD5n1g',
  })
  @IsNotEmpty()
  @IsString()
  token!: string;
}
