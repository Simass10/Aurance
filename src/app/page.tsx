'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Building2, User, ArrowRight, Upload, Camera, X, MapPin, Globe } from 'lucide-react';
import type { UserProfile, QuizAnswer, COUNTRY_CURRENCY_MAP } from '@/lib/types';
import { COUNTRY_CURRENCY_MAP } from '@/lib/types';
import { toast } from 'sonner';
import { AuranceLogo } from '@/components/custom/AuranceLogo';

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [quizData, setQuizData] = useState<Partial<QuizAnswer>>({});
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleProfileSelect = (profile: UserProfile) => {
    setQuizData({ ...quizData, profile });
    setStep(1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande', {
        description: 'Por favor, selecione uma imagem menor que 5MB',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setProfileImage(imageData);
      setQuizData({ ...quizData, profileImage: imageData });
      toast.success('Imagem carregada com sucesso!');
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setProfileImage(null);
    setQuizData({ ...quizData, profileImage: undefined });
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleCountryChange = (country: string) => {
    const currencyInfo = COUNTRY_CURRENCY_MAP[country];
    setQuizData({
      ...quizData,
      nationality: country,
      currency: currencyInfo?.symbol || '€',
    });
  };

  const handleComplete = () => {
    // Validar campos obrigatórios
    if (!quizData.name || !quizData.nationality || !quizData.origin) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Salvar dados no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userProfile', JSON.stringify(quizData));
      toast.success('Perfil configurado com sucesso!');
      window.location.href = '/dashboard';
    }
  };

  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-12 md:py-20">
          {/* Header com Logo Aurance */}
          <div className="text-center mb-12 md:mb-16">
            <div className="flex justify-center mb-8">
              <AuranceLogo size="xl" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Organize as suas finanças
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simples, visual e eficiente. Comece por nos dizer qual é o seu perfil.
            </p>
          </div>

          {/* Profile Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card 
              className="cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 hover:border-violet-500 bg-white dark:bg-gray-900"
              onClick={() => handleProfileSelect('personal')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Pessoal</CardTitle>
                <CardDescription className="text-base">
                  Controle as suas finanças pessoais e familiares
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700">
                  Começar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 hover:border-indigo-500 bg-white dark:bg-gray-900"
              onClick={() => handleProfileSelect('commerce')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Comércio</CardTitle>
                <CardDescription className="text-base">
                  Gerencie vendas, despesas e lucros do seu negócio
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700">
                  Começar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 hover:border-blue-500 bg-white dark:bg-gray-900"
              onClick={() => handleProfileSelect('business')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Empresa</CardTitle>
                <CardDescription className="text-base">
                  Controle completo das finanças empresariais
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Começar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold mb-2">Gráficos Modernos</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visualize receitas e despesas de forma clara
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-semibold mb-2">IA Integrada</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Análise automática e dicas personalizadas
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">Automação</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure despesas e receitas recorrentes
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <AuranceLogo size="md" />
            </div>
            <CardTitle className="text-3xl text-center">Complete o seu perfil</CardTitle>
            <CardDescription className="text-center text-base">
              Preencha as informações para personalizar a sua experiência
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload de Imagem/Logo */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                {quizData.profile === 'personal' ? (
                  <>
                    <User className="w-4 h-4" />
                    Foto de Perfil
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4" />
                    Logótipo
                  </>
                )}
              </Label>
              
              {!profileImage ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-32 border-dashed border-2 hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-violet-500" />
                      <span className="text-sm font-medium">Carregar Ficheiro</span>
                    </div>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-32 border-dashed border-2 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Camera className="w-8 h-8 text-indigo-500" />
                      <span className="text-sm font-medium">Tirar Foto</span>
                    </div>
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden border-4 border-violet-500 bg-white dark:bg-gray-800 p-4">
                    <img
                      src={profileImage}
                      alt="Perfil"
                      className={`w-full ${quizData.profile === 'personal' ? 'h-64 object-cover' : 'h-48 object-contain'} rounded-xl`}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-6 right-6 shadow-lg"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground text-center">
                {quizData.profile === 'personal' 
                  ? '📷 Adicione uma foto para personalizar o seu perfil' 
                  : '🎨 O logótipo será usado para personalizar as cores da aplicação'}
              </p>
            </div>

            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">
                {quizData.profile === 'personal' ? 'Nome Completo' : 'Nome da Empresa/Comércio'} *
              </Label>
              <Input
                id="name"
                placeholder={quizData.profile === 'personal' ? 'Ex: João Silva' : 'Ex: Restaurante Sabor'}
                value={quizData.name || ''}
                onChange={(e) => setQuizData({ ...quizData, name: e.target.value })}
                className="text-base"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={quizData.email || ''}
                onChange={(e) => setQuizData({ ...quizData, email: e.target.value })}
                className="text-base"
              />
            </div>

            {/* Naturalidade/País */}
            <div className="space-y-2">
              <Label htmlFor="nationality" className="text-base font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Naturalidade/País *
              </Label>
              <Select onValueChange={handleCountryChange} value={quizData.nationality}>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Selecione o seu país" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(COUNTRY_CURRENCY_MAP).map((country) => (
                    <SelectItem key={country} value={country}>
                      {country} ({COUNTRY_CURRENCY_MAP[country].symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {quizData.nationality && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  💰 Moeda: {COUNTRY_CURRENCY_MAP[quizData.nationality]?.currency} ({quizData.currency})
                </p>
              )}
            </div>

            {/* Origem/Cidade */}
            <div className="space-y-2">
              <Label htmlFor="origin" className="text-base font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Cidade/Região de Origem *
              </Label>
              <Input
                id="origin"
                placeholder="Ex: Lisboa, São Paulo, Porto..."
                value={quizData.origin || ''}
                onChange={(e) => setQuizData({ ...quizData, origin: e.target.value })}
                className="text-base"
              />
            </div>

            {/* Campos específicos por perfil */}
            {quizData.profile === 'personal' && (
              <div className="space-y-2">
                <Label htmlFor="income" className="text-base font-semibold">
                  Rendimento mensal aproximado ({quizData.currency || '€'})
                </Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="Ex: 1500"
                  value={quizData.monthlyIncome || ''}
                  onChange={(e) => setQuizData({ ...quizData, monthlyIncome: Number(e.target.value) })}
                  className="text-base"
                />
              </div>
            )}

            {quizData.profile === 'commerce' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessType" className="text-base font-semibold">
                    Tipo de comércio
                  </Label>
                  <Input
                    id="businessType"
                    placeholder="Ex: Restaurante, Loja de roupa..."
                    value={quizData.businessType || ''}
                    onChange={(e) => setQuizData({ ...quizData, businessType: e.target.value })}
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income" className="text-base font-semibold">
                    Faturação mensal média ({quizData.currency || '€'})
                  </Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="Ex: 5000"
                    value={quizData.monthlyIncome || ''}
                    onChange={(e) => setQuizData({ ...quizData, monthlyIncome: Number(e.target.value) })}
                    className="text-base"
                  />
                </div>
              </div>
            )}

            {quizData.profile === 'business' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessType" className="text-base font-semibold">
                    Setor da empresa
                  </Label>
                  <Input
                    id="businessType"
                    placeholder="Ex: Tecnologia, Consultoria..."
                    value={quizData.businessType || ''}
                    onChange={(e) => setQuizData({ ...quizData, businessType: e.target.value })}
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Tem funcionários?</Label>
                  <RadioGroup 
                    value={quizData.hasEmployees ? 'yes' : 'no'}
                    onValueChange={(value) => setQuizData({ ...quizData, hasEmployees: value === 'yes' })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes" className="font-normal cursor-pointer">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no" className="font-normal cursor-pointer">Não</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setStep(0)}
              >
                Voltar
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                onClick={handleComplete}
              >
                Começar a usar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              * Campos obrigatórios
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
