export type Provider = {
    id: 0,
    name: string,
    address: string,
    phone: number,
    email: string
  }

  export type AllProvidersProps = {
    items: Provider[];
    numPages: number;
    offset: number;
    limit: number;
    totalItems: number;
  }