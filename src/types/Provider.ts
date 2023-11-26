export type Provider = {
    id: 0|string,
    name: string,
    address: string,
    phone: string|number,
    email: string
  }

  export type AllProvidersProps = {
    items: Provider[];
    numPages: number;
    offset: number;
    limit: number;
    totalItems: number;
  }