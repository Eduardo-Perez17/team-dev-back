import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import * as fs from 'fs';

// Helpers
import { ErrorManager } from 'src/commons/utils/error.manager';

@Controller('upload')
export class UploadController {
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Upload image.',
    description: 'this endpoint is for upload an image.',
  })
  @ApiBody({
    description: 'The fields to be upload image.',
  })
  @ApiResponse({
    status: 201,
    description: 'upload image successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'image exist.',
  })
  @Post()
  async uploadFiles(@Body() files) {
    const listPaths = [];
    try {
      for (const file of files) {
        const data = file.content.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(data, 'base64');
        const filename = `${Date.now()}-${file.filename}`;
        const filePath = './upload/' + filename;
        fs.writeFile(filePath, buffer, (err) => {
          if (err) {
            throw ErrorManager.createSignatureError(err.message);
          }
        });

        listPaths.push(filename);
      }
      return listPaths;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
