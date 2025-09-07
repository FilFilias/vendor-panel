
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ProductFilterValues } from "~/components/products/ProductFilters"
import { i18nCookie } from "./locale-cookie";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isFilterApplied(filters: ProductFilterValues): boolean {
  return (
    !!filters.searchTerm ||
    filters.categories.length > 0 ||
    filters.status !== "all" ||
    filters.visibility !== "all" ||
    !!filters.priceRange.min ||
    !!filters.priceRange.max
  );
}

export const handleLocalization = async (request:Request) => {
  let localeCookie = await i18nCookie.parse(request.headers.get("Cookie"))
  if (localeCookie) {
    return localeCookie
  }

  return 'el'
}

export const validateTextInput = (inputName: string, inputValue: FormDataEntryValue | null) => {
  if (inputValue && typeof inputValue == 'string') {
      if (inputValue.trim() !== '') {
          return null;
      }
  }
  return `${inputName}_is_required`;
}

export const validatePassword = (inputValue:FormDataEntryValue  | null) => {
  if (inputValue && typeof inputValue == 'string') {
      if (inputValue.trim() !== '') {
          if (inputValue.trim().length < 4) {
              return "validation_form_password_minimum_chars"
          }
          return null;
      }
  }
  return "validation_form_required_pass"
}

export const validateConfirmPassword = (Password:FormDataEntryValue  | null, confirmPassword:FormDataEntryValue  | null) => {
  if (confirmPassword && typeof confirmPassword == 'string') {
      if (confirmPassword !== Password ) {
          return "confirm_password_is_required"
      }
      return null
  }
  return "confirm_password_is_required"
}

export const validateRoleInput = (inputValue: FormDataEntryValue | null) => {
  if (inputValue && typeof inputValue == 'string') {
      if (inputValue.trim() !== '' ) {
        if (inputValue !== 'admin' && inputValue !=='user') {
          return `role_type_error`;
        }
          return null;
      }
  }
  return `role_is_required`;
}
