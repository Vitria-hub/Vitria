import { useState, useCallback } from 'react';

interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

interface FieldValidation {
  [fieldName: string]: ValidationRule[];
}

interface ValidationErrors {
  [fieldName: string]: string | null;
}

export function useFormValidation<T extends Record<string, any>>(
  validationRules: FieldValidation
) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback(
    (fieldName: string, value: any): string | null => {
      const rules = validationRules[fieldName];
      if (!rules) return null;

      for (const rule of rules) {
        if (!rule.validate(value)) {
          return rule.message;
        }
      }
      return null;
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (fieldName: string, value: any) => {
      const error = validateField(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
    },
    [validateField]
  );

  const handleBlur = useCallback((fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  }, []);

  const validateAll = useCallback(
    (values: T): boolean => {
      const newErrors: ValidationErrors = {};
      let isValid = true;

      Object.keys(validationRules).forEach((fieldName) => {
        const error = validateField(fieldName, values[fieldName]);
        newErrors[fieldName] = error;
        if (error) isValid = false;
      });

      setErrors(newErrors);
      setTouched(
        Object.keys(validationRules).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        )
      );

      return isValid;
    },
    [validationRules, validateField]
  );

  const getFieldError = useCallback(
    (fieldName: string): string | null => {
      return touched[fieldName] ? errors[fieldName] || null : null;
    },
    [errors, touched]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return {
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    getFieldError,
    clearErrors,
  };
}

// Helper validation functions
export const validations = {
  required: (message: string = 'Este campo es requerido'): ValidationRule => ({
    validate: (value) => {
      if (typeof value === 'string') return value.trim().length > 0;
      return value !== null && value !== undefined && value !== '';
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (typeof value === 'string') return value.length >= min;
      return true;
    },
    message: message || `Debe tener al menos ${min} caracteres`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (typeof value === 'string') return value.length <= max;
      return true;
    },
    message: message || `Debe tener máximo ${max} caracteres`,
  }),

  email: (message: string = 'Email inválido'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),

  url: (message: string = 'URL inválida'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return regex.test(value);
    },
    message,
  }),

  custom: (
    validator: (value: any) => boolean,
    message: string
  ): ValidationRule => ({
    validate: validator,
    message,
  }),
};
