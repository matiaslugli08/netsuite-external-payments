

import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateStripeSessionDTO } from './dto/create-stripe-session.dto';

var apiKey = 'pk_test_51MAP0LLQ2msoaAhmasLqBgDb87E7cbXk61TpYqAjAbVYwHZIaWT0ipOt5XiRXHpWZa61KdmneSuUKufNUgiQFM7Z00GBBBeZn6';

const stripe = require('stripe')(apiKey);

console.log('process.env')
console.log(process.env)

@Controller('stripe')
export class StripeController {

  @Post()
  async redirectToStripe(@Body() createStripeSessionDTO: CreateStripeSessionDTO) {

  
    var shipping_method_selected = createStripeSessionDTO.shipping_method_selected;
    var shipping_methods = createStripeSessionDTO.shipping_methods;
    var shipping_data = createStripeSessionDTO.shipping_data;
    var items = createStripeSessionDTO.items;
    var message = createStripeSessionDTO.message;

    
    
    // Replacing unwanted chars from NetSuite
    // ShippingMethod Rate contains a '$' at the beggining
    // shipping_method_selected.rate = (parseFloat(shipping_method_selected.rate) * 100);
    shipping_method_selected.rate = shipping_method_selected.rate;


    var line_items = items.map(({amount ,name,quantity})=>{ 

      return {
        "price_data":{
          "currency":"usd",
          "product_data":{
            "name":name
          },
          "unit_amount":  Math.round((parseFloat(amount) * 100) * 100) / 100 ,
        },
        "quantity":quantity
      }
    
    });
   

    var shipping_options = [
      {
        "shipping_rate_data":{
          "type": 'fixed_amount',
          "fixed_amount": {
            // "amount": shipping_method_selected.rate,
            "amount":  Math.round((parseFloat(shipping_method_selected.rate) * 100) * 100) / 100,
            
            "currency": 'usd'
          },
          "display_name": shipping_method_selected.name
        }
      }
    ]

    console.log(shipping_options)
    console.log(shipping_options[0].shipping_rate_data)
     console.log(shipping_options[0].shipping_rate_data.fixed_amount)


    var created_session = await stripe.checkout.sessions.create({
        success_url: process.env.STRIPE_REDIRECT_DOMAIN,
        payment_method_types:["card","affirm"],
        mode: 'payment',
        line_items: line_items,
        shipping_options:shipping_options
   });

      

      // created_session = JSON.parse(CircularJSON.stringify(created_session));
      return {
        status:"ok",
        created_session: created_session
      }
   

  
  }
}