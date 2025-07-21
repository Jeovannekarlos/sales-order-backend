import cds, {Request, service, Service} from '@sap/cds';
import {Customer, Customers, Product, Products, SalesOrderItem} from '@models/sales';
import { getMaxListeners } from 'events';

export default (service :Service) => {
    service.after ('READ', 'Customers', (results: Customers) => {
        results.forEach(customer => {
            if (!customer.email?.includes('@')){
                customer.email = `${customer.email}@gmail.com`;
            }
        })
    })
    service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
        const params = request.data;
        if (!params.customer_id){
            return request.reject(400, 'Customer inválido');
        }
        if (!params.items || params.items?.length === 0){
            return request.reject(400, 'Itens inválidos');
        }
        const cutomerQuery = SELECT.one.from('sales.Customers').where({id: params.customer_id});
        const customer = await cds.run(cutomerQuery);
        console.log(customer);

        if (!customer){
            return request.reject(404, 'Customer não encontrado');
        }

        const productsIds: string[] = params.items.map((item: SalesOrderItem) => item.product_id);
        const productsQuery = SELECT.from('sales.Products').where({id: productsIds});
        const products: Products = await cds.run(productsQuery);
        for (const item of params.items){
            const dbProduct = products.find(product => product.id === item.product_id);
            if (!dbProduct){
                return request.reject(404, `Produto ${item.product_id} não encontrado`);
            }
            if (dbProduct.stock === 0){
                return request.reject(400, `Produto ${dbProduct.name}(${dbProduct.id}) sem estoque disponível`);
            }
        }
    })
}