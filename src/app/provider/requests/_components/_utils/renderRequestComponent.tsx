import { ReactNode } from 'react';
import { AnyRequestView } from '@/lib/request/client/view/types';
import { RequestType } from '@/lib/request/requestType';
import { ClientAccommodationRequestViewComponent } from '../ClientAccommodationRequestViewComponent';
import { ClientTransportRequestViewComponent } from '../ClientTransportRequestViewComponent';
import { ClientEntertainmentRequestViewComponent } from '../ClientEntertainmentRequestViewComponent';
import { ClientDefaultRequestViewComponent } from '../ClientDefaultRequestViewComponent';
import { ClientFoodRequestViewComponent } from '../ClientFoodRequestViewComponent';
import { ClientHealthRequestViewComponent } from '../ClientHealthRequestViewComponent';
import { ClientPackageRequestViewComponent } from '../ClientPackageRequestViewComponent';

/**
 * Рендерит соответствующий компонент для типа заявки
 */
export function renderRequestComponent(request: AnyRequestView): ReactNode {
  switch (request.requestType) {
    case RequestType.ACCOMMODATION:
      return <ClientAccommodationRequestViewComponent data={request as any} />;
    case RequestType.TRANSPORT:
      return <ClientTransportRequestViewComponent data={request as any} />;
    case RequestType.ENTERTAINMENT:
      return <ClientEntertainmentRequestViewComponent data={request as any} />;
    case RequestType.FOOD:
      return <ClientFoodRequestViewComponent data={request as any} />;
    case RequestType.HEALTH:
      return <ClientHealthRequestViewComponent data={request as any} />;
    case RequestType.PACKAGE:
      return <ClientPackageRequestViewComponent data={request as any} />;
    default:
      return <ClientDefaultRequestViewComponent data={request} />;
  }
}

