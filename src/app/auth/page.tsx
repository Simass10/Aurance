'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuranceLogo } from '@/components/custom/AuranceLogo';

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se já está autenticado
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Verificar se tem perfil
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (profile) {
            router.push('/dashboard');
          } else {
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Verificar se tem perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (profile) {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <AuranceLogo size="xl" />
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <AuranceLogo size="lg" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Bem-vindo ao Aurance
          </CardTitle>
          <CardDescription className="text-base">
            Entre ou crie a sua conta para começar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#7c3aed',
                    brandAccent: '#6d28d9',
                  },
                  radii: {
                    borderRadiusButton: '0.75rem',
                    buttonBorderRadius: '0.75rem',
                    inputBorderRadius: '0.75rem',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'font-semibold',
                input: 'font-normal',
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Palavra-passe',
                  email_input_placeholder: 'O seu email',
                  password_input_placeholder: 'A sua palavra-passe',
                  button_label: 'Entrar',
                  loading_button_label: 'A entrar...',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Já tem conta? Entre',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Palavra-passe',
                  email_input_placeholder: 'O seu email',
                  password_input_placeholder: 'A sua palavra-passe',
                  button_label: 'Criar conta',
                  loading_button_label: 'A criar conta...',
                  social_provider_text: 'Criar conta com {{provider}}',
                  link_text: 'Não tem conta? Crie uma',
                },
                forgotten_password: {
                  email_label: 'Email',
                  password_label: 'Palavra-passe',
                  email_input_placeholder: 'O seu email',
                  button_label: 'Enviar instruções',
                  loading_button_label: 'A enviar...',
                  link_text: 'Esqueceu a palavra-passe?',
                },
                update_password: {
                  password_label: 'Nova palavra-passe',
                  password_input_placeholder: 'A sua nova palavra-passe',
                  button_label: 'Atualizar palavra-passe',
                  loading_button_label: 'A atualizar...',
                },
                verify_otp: {
                  email_input_label: 'Email',
                  email_input_placeholder: 'O seu email',
                  phone_input_label: 'Telefone',
                  phone_input_placeholder: 'O seu telefone',
                  token_input_label: 'Código',
                  token_input_placeholder: 'O seu código OTP',
                  button_label: 'Verificar',
                  loading_button_label: 'A verificar...',
                },
              },
            }}
            providers={[]}
            redirectTo={typeof window !== 'undefined' ? window.location.origin : ''}
          />
        </CardContent>
      </Card>
    </div>
  );
}
