'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Clock3, Mail, MapPin, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

import { FadeInSection } from '@/components/layout/fade-in-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  message: z.string().min(10, 'Please enter at least 10 characters'),
});

type ContactFormValues = z.infer<typeof schema>;

export default function ContactPage(): React.ReactElement {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = (values: ContactFormValues): void => {
    void values;
    toast.success('Your message has been submitted. Our placement office will contact you soon.');
    form.reset();
  };

  return (
    <div className='container grid gap-6 py-12 lg:grid-cols-[1.1fr_0.9fr]'>
      <FadeInSection>
        <Card>
          <CardHeader>
            <CardTitle>Contact Placement Cell</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField name='name'>
                  {({ id }) => (
                    <FormItem>
                      <FormLabel htmlFor={id}>Name</FormLabel>
                      <FormControl>
                        <Input id={id} {...form.register('name')} />
                      </FormControl>
                      <FormMessage name='name' />
                    </FormItem>
                  )}
                </FormField>
                <FormField name='email'>
                  {({ id }) => (
                    <FormItem>
                      <FormLabel htmlFor={id}>Email</FormLabel>
                      <FormControl>
                        <Input id={id} type='email' {...form.register('email')} />
                      </FormControl>
                      <FormMessage name='email' />
                    </FormItem>
                  )}
                </FormField>
                <FormField name='message'>
                  {({ id }) => (
                    <FormItem>
                      <FormLabel htmlFor={id}>Message</FormLabel>
                      <FormControl>
                        <Textarea id={id} {...form.register('message')} />
                      </FormControl>
                      <FormMessage name='message' />
                    </FormItem>
                  )}
                </FormField>
                <Button type='submit'>Send Message</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </FadeInSection>

      <FadeInSection>
        <Card className='h-full'>
          <CardHeader>
            <CardTitle>Office Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 text-sm text-muted-foreground'>
            <p className='flex items-start gap-2'>
              <MapPin className='mt-0.5 h-4 w-4 text-primary' />
              Vasantrao Naik Mahavidyalaya, Airport Road, Cidco Aurangabad, Maharashtra - 431001, India.
            </p>
            <p className='flex items-center gap-2'>
              <Mail className='h-4 w-4 text-primary' /> placement@naikcollege.org
            </p>
            <p className='flex items-center gap-2'>
              <Phone className='h-4 w-4 text-primary' /> +91 02565 223045
            </p>
            <p className='flex items-start gap-2'>
              <Clock3 className='mt-0.5 h-4 w-4 text-primary' />
              Monday to Saturday: 10:00 AM - 5:00 PM
            </p>
          </CardContent>
        </Card>
      </FadeInSection>
    </div>
  );
}
