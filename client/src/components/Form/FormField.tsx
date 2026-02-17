import React from 'react';
import { FieldPath, FieldValues, Controller, ControllerProps } from 'react-hook-form';
import { Label } from '../ui/Label';
import { cn } from '../../lib/utils';

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'> {
  label?: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  description,
  error,
  children,
  className,
  ...props
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label htmlFor={props.name}>{label}</Label>}
      {description && <p className="text-sm text-slate-500">{description}</p>}
      <Controller
        {...props}
        render={({ field }) => (
          <>
            {React.isValidElement(children)
              ? React.cloneElement(children as React.ReactElement<any>, {
                  ...field,
                  id: props.name,
                })
              : children}
          </>
        )}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
