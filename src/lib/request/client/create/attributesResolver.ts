import {RequestType} from "@/lib/request/requestType";

type AttributesInclude = {
  tbids_accomodation_attrs?: boolean;
  tbids_transport_attrs?: boolean;
  tbids_entertainment_attrs?: boolean;
};

type AttributesMappingFunction<T> = (data: any) => T;

export function resolveAttributesInclude(requestType: RequestType): {
  include: AttributesInclude;
  mapAttributes: AttributesMappingFunction<any>;
} {
  switch (requestType) {
    case RequestType.ACCOMMODATION:
      return {
        include: { tbids_accomodation_attrs: true },
        mapAttributes: (attrs: any) => ({
          dateFrom: attrs.date_from ? formatDateToDDMMYY(new Date(attrs.date_from)) : undefined,
          dateTo: attrs.date_to ? formatDateToDDMMYY(new Date(attrs.date_to)) : undefined,
          adultsQty: attrs.adults_qty ?? undefined,
          kidsQty: attrs.kids_qty ?? undefined,
        }),
      };
    case RequestType.TRANSPORT:
      return {
        include: { tbids_transport_attrs: true },
        mapAttributes: (attrs: any) => ({
          provisionTime: attrs.provision_time ? formatDateToDDMMYYHHmm(new Date(attrs.provision_time)) : undefined,
          adultsQty: attrs.adults_qty ?? undefined,
          kidsQty: attrs.kids_qty ?? undefined,
        }),
      };
    case RequestType.ENTERTAINMENT:
      return {
        include: { tbids_entertainment_attrs: true },
        mapAttributes: (attrs: any) => ({
          provisionTime: attrs.provision_time ? formatDateToDDMMYYHHmm(new Date(attrs.provision_time)) : undefined,
          adultsQty: attrs.adults_qty ?? undefined,
        }),
      };
    default:
      return {
        include: {},
        mapAttributes: () => ({}),
      };
  }
}

function formatDateToDDMMYY(date: Date): string {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
}

function formatDateToDDMMYYHHmm(date: Date): string {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear().toString().slice(-2);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}
