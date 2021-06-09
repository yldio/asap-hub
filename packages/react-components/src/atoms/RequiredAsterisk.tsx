type RequiredAsteriskProps =
  | {
      readonly required?: false;
      readonly omitRequiredAsterisk?: never;
    }
  | { readonly required?: true; readonly omitRequiredAsterisk?: boolean };

const RequiredAsterisk: React.FC<RequiredAsteriskProps> = ({
  required = false,
  omitRequiredAsterisk = false,
}) => (required && !omitRequiredAsterisk && <>*</>) || null;

export default RequiredAsterisk;
