'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyhole, Mail, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const schema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage(): React.ReactElement {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: FormValues): Promise<void> => {
    await login(values);
  };

  return (
    <Form {...form}>
      <form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>

        {/* EMAIL FIELD */}
        <FormField name='email'>
          {({ id }) => (
            <FormItem>
              <FormLabel htmlFor={id}>Email</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Mail className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    id={id}
                    type='email'
                    className='pl-10'
                    placeholder='admin@college.edu'
                    {...form.register('email')}
                  />
                </div>
              </FormControl>
              <FormMessage name='email' />
            </FormItem>
          )}
        </FormField>

        {/* PASSWORD FIELD */}
        <FormField name='password'>
          {({ id }) => (
            <FormItem>
              <FormLabel htmlFor={id}>Password</FormLabel>
              <FormControl>
                <div className='relative'>

                  {/* Left Icon */}
                  <LockKeyhole className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />

                  {/* Input */}
                  <Input
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    className='pl-10 pr-10'
                    placeholder='Enter password'
                    {...form.register('password')}
                  />

                  {/* Eye Toggle Button */}
                  <button
                    type='button'
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition'
                    aria-label='Toggle password visibility'
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage name='password' />
            </FormItem>
          )}
        </FormField>

        <Button className='h-11 w-full' type='submit' disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  );
}
