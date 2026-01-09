import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type CartItem = {
  id: number;
  amount: number;
  quantity: number;
};

const giftCards = [
  { id: 1, amount: 1000, popular: false },
  { id: 2, amount: 2000, popular: true },
  { id: 3, amount: 3000, popular: false },
  { id: 4, amount: 5000, popular: false },
  { id: 5, amount: 10000, popular: false },
  { id: 6, amount: 15000, popular: false },
];

const features = [
  {
    icon: 'Smartphone',
    title: 'Быстрая доставка',
    description: 'Код карты приходит на email мгновенно после оплаты'
  },
  {
    icon: 'ShieldCheck',
    title: 'Безопасно',
    description: 'Официальные карты Apple с гарантией активации'
  },
  {
    icon: 'Gift',
    title: 'Удобный подарок',
    description: 'Идеальный вариант для любого повода и получателя'
  }
];

const faqs = [
  {
    question: 'Как активировать карту?',
    answer: 'Откройте App Store, нажмите на свой профиль, выберите "Погасить подарочную карту" и введите полученный код.'
  },
  {
    question: 'Где можно использовать карту?',
    answer: 'В App Store, iTunes Store, Apple Music, iCloud+ и для покупки подписок на сервисы Apple.'
  },
  {
    question: 'Есть ли срок действия карты?',
    answer: 'Нет, карты Apple Gift Card не имеют срока действия и могут быть использованы в любое время.'
  },
  {
    question: 'Можно ли вернуть карту?',
    answer: 'Электронные карты возврату не подлежат после получения кода активации.'
  },
  {
    question: 'Какие способы оплаты доступны?',
    answer: 'Принимаем банковские карты Visa, Mastercard, МИР, а также электронные кошельки и СБП.'
  }
];

export default function Index() {
  const [activeSection, setActiveSection] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const addToCart = (cardId: number, amount: number) => {
    const existingItem = cart.find(item => item.id === cardId);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === cardId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { id: cardId, amount, quantity: 1 }]);
    }

    toast({
      title: 'Добавлено в корзину',
      description: `Карта на ${amount.toLocaleString('ru-RU')} ₽ добавлена`,
    });
  };

  const removeFromCart = (cardId: number) => {
    setCart(cart.filter(item => item.id !== cardId));
  };

  const updateQuantity = (cardId: number, change: number) => {
    setCart(cart.map(item => {
      if (item.id === cardId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 glass border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Icon name="Gift" size={28} className="text-primary" />
              <span className="text-xl font-semibold">Apple Gift Card</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Главная
              </button>
              <button 
                onClick={() => scrollToSection('catalog')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Каталог
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                О карте
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                FAQ
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button size="sm" variant="outline" className="relative">
                    <Icon name="ShoppingCart" size={18} />
                    {getTotalItems() > 0 && (
                      <Badge 
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle className="text-2xl">Корзина</SheetTitle>
                  </SheetHeader>
                  
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center">
                      <Icon name="ShoppingCart" size={64} className="text-muted-foreground mb-4 opacity-30" />
                      <p className="text-lg text-muted-foreground mb-2">Корзина пуста</p>
                      <p className="text-sm text-muted-foreground">Добавьте карты из каталога</p>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full mt-8">
                      <div className="flex-1 overflow-auto space-y-4">
                        {cart.map((item) => (
                          <Card key={item.id} className="glass-card border-white/40">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="font-semibold text-lg">{item.amount.toLocaleString('ru-RU')} ₽</p>
                                  <p className="text-sm text-muted-foreground">Apple Gift Card</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Icon name="Trash2" size={16} />
                                </Button>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Icon name="Minus" size={14} />
                                  </Button>
                                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Icon name="Plus" size={14} />
                                  </Button>
                                </div>
                                <p className="font-semibold">
                                  {(item.amount * item.quantity).toLocaleString('ru-RU')} ₽
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="mt-6 space-y-4">
                        <Separator />
                        <div className="flex justify-between items-center text-lg font-semibold">
                          <span>Итого:</span>
                          <span className="text-2xl">{getTotalAmount().toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <Button 
                          className="w-full h-12 text-base" 
                          size="lg"
                          onClick={() => {
                            toast({
                              title: 'Переход к оплате',
                              description: 'Функция оплаты будет доступна в следующей версии',
                            });
                          }}
                        >
                          Оформить заказ
                          <Icon name="ArrowRight" size={18} className="ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
              <Button size="sm">Войти</Button>
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Apple Gift Card
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Подарите доступ к миллионам приложений, игр, музыки и фильмов в экосистеме Apple
            </p>
            <Button 
              size="lg" 
              className="h-12 px-8 text-base shadow-2xl hover:shadow-primary/50 transition-all duration-300"
              onClick={() => scrollToSection('catalog')}
            >
              Выбрать номинал
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="glass-card border-white/30 hover:shadow-2xl transition-all duration-300 animate-scale-in hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <Icon name={feature.icon as any} size={40} className="text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Выберите номинал</h2>
            <p className="text-lg text-muted-foreground">
              Все карты доставляются мгновенно на ваш email
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {giftCards.map((card) => (
              <Card 
                key={card.id} 
                className={`relative overflow-hidden glass-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                  card.popular ? 'border-primary/50 border-2 shadow-xl' : 'border-white/30'
                }`}
              >
                {card.popular && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Популярно
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-center h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4">
                    <Icon name="CreditCard" size={64} className="text-primary opacity-50" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-center">
                    {card.amount.toLocaleString('ru-RU')} ₽
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full h-11" 
                    variant={card.popular ? "default" : "outline"}
                    onClick={() => addToCart(card.id, card.amount)}
                  >
                    Добавить в корзину
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Как это работает</h2>
          
          <div className="space-y-8">
            <Card className="border-l-4 border-l-primary glass-card border-white/30 shadow-md">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <CardTitle className="mb-2">Выберите номинал</CardTitle>
                    <CardDescription className="text-base">
                      Доступны карты от 1 000 до 15 000 рублей. Выберите подходящую сумму в зависимости от ваших потребностей.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-primary glass-card border-white/30 shadow-md">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <CardTitle className="mb-2">Оплатите покупку</CardTitle>
                    <CardDescription className="text-base">
                      Безопасная оплата банковской картой, электронным кошельком или через СБП. Все транзакции защищены.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-primary glass-card border-white/30 shadow-md">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <CardTitle className="mb-2">Получите код</CardTitle>
                    <CardDescription className="text-base">
                      Код активации придет на указанный email в течение нескольких минут после успешной оплаты.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-primary glass-card border-white/30 shadow-md">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <CardTitle className="mb-2">Активируйте в App Store</CardTitle>
                    <CardDescription className="text-base">
                      Введите полученный код в вашем Apple ID и пользуйтесь всеми сервисами Apple без ограничений.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Часто задаваемые вопросы</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Ответы на популярные вопросы о покупке и использовании карт
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="glass-dark border-white/40 rounded-lg px-6 shadow-md"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <footer className="glass-dark text-foreground py-12 px-4 sm:px-6 lg:px-8 border-t border-white/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Gift" size={24} />
                <span className="font-semibold text-lg">Apple Gift Card</span>
              </div>
              <p className="text-sm opacity-80">
                Официальный магазин подарочных карт Apple
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Поддержка</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Служба поддержки</li>
                <li>Условия использования</li>
                <li>Политика конфиденциальности</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} />
                  <span>support@giftcard.ru</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon name="Phone" size={16} />
                  <span>8 (800) 555-35-35</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-background/20 pt-8 text-center text-sm opacity-60">
            © 2026 Apple Gift Card Store. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}