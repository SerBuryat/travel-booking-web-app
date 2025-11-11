import {prisma} from '@/lib/db/prisma';
import {ProviderEntity} from '@/entity/ProviderEntity';

export class ProviderRepository {

  /**
   * Найти провайдера по ID клиента
   */
  async findByClientId(clientId: number): Promise<ProviderEntity | null> {
    try {
      const provider = await prisma.tproviders.findFirst({
        where: { tclients_id: clientId }
      });
      
      if (!provider) return null;
      
      return {
        id: provider.id,
        tclients_id: provider.tclients_id,
        company_name: provider.company_name,
        phone: provider.phone,
        contact_info: provider.contact_info,
        status: provider.status,
        created_at: provider.created_at,
      };
    } catch (error) {
      console.error('Error finding provider by client ID:', error);
      return null;
    }
  }

}
