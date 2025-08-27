import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const validateBody = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(dtoClass, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        const errorMessages = errors.map((error: ValidationError) => ({
          property: error.property,
          constraints: error.constraints,
          value: error.value,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errorMessages,
        });
        return;
      }

      req.body = dto;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Validation error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
};

export const validateQuery = (allowedParams: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const invalidParams = Object.keys(req.query).filter(
      (param) => !allowedParams.includes(param)
    );

    if (invalidParams.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        invalid_params: invalidParams,
        allowed_params: allowedParams,
      });
      return;
    }

    next();
  };
};

export const validateUUID = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const value = req.params[paramName];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(value)) {
      res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format. Expected UUID.`,
      });
      return;
    }

    next();
  };
};

export const validatePagination = (req: Request, res: Response, next: NextFunction): void => {
  const { limit, offset } = req.query;

  if (limit) {
    const limitNum = parseInt(limit as string);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 1000) {
      res.status(400).json({
        success: false,
        message: 'Limit must be a number between 1 and 1000',
      });
      return;
    }
  }

  if (offset) {
    const offsetNum = parseInt(offset as string);
    if (isNaN(offsetNum) || offsetNum < 0) {
      res.status(400).json({
        success: false,
        message: 'Offset must be a non-negative number',
      });
      return;
    }
  }

  next();
};