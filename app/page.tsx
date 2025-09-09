import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Zap, Globe, Users, TrendingUp, Lock, CheckCircle, ArrowRight, Coins, BarChart3 } from "lucide-react"

export default function MedChainIDO() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">MedChain</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#products" className="text-muted-foreground hover:text-foreground transition-colors">
              Products
            </a>
            <a href="#tokenomics" className="text-muted-foreground hover:text-foreground transition-colors">
              Tokenomics
            </a>
            <a href="#roadmap" className="text-muted-foreground hover:text-foreground transition-colors">
              Roadmap
            </a>
            <Button>Join IDO</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/modern-african-healthcare-facility-with-blockchain.jpg"
            alt="Healthcare technology background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/85 backdrop-blur-sm"></div>
        </div>
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-4" variant="secondary">
            <Zap className="w-4 h-4 mr-1" />
            IDO Live Now
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Africa's Leading <span className="text-primary">Blockchain Healthcare</span> Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Eliminating counterfeit drugs and securing health records with blockchain technology. Join the revolution
            transforming healthcare across Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8">
              Participate in IDO
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Read Whitepaper
            </Button>
          </div>

          {/* IDO Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">₦2.50</div>
                <div className="text-sm text-muted-foreground">Token Price</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">₦500M</div>
                <div className="text-sm text-muted-foreground">Target Raise</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">200M</div>
                <div className="text-sm text-muted-foreground">MCH Tokens</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">20%</div>
                <div className="text-sm text-muted-foreground">of Total Supply</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section id="about" className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/african-pharmacy-with-medicine-bottles-and-blockch.jpg"
            alt="Pharmaceutical supply chain"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-muted/90"></div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Transforming African Healthcare</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Addressing critical healthcare challenges with innovative blockchain solutions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-destructive">The Problem</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    Counterfeit drugs plague African markets, endangering millions of lives
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    Fragmented health records limit quality care and patient mobility
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Lack of transparency in pharmaceutical supply chains</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Limited access to affordable, authentic medications</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 text-primary">Our Solution</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Blockchain-verified pharmaceutical supply chain ensuring drug authenticity
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">Secure, tokenized digital health records owned by patients</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Transparent, traceable medication journey from manufacturer to patient
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">Crypto-enabled payments and insurance claims processing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/modern-digital-healthcare-dashboard-with-blockchai.jpg"
            alt="Digital healthcare products"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Product Suite</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive blockchain solutions for the entire healthcare ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>MedChain Supply</CardTitle>
                <CardDescription>
                  Blockchain-based pharmaceutical supply chain system to track drug authenticity from manufacturer to
                  patient.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real-time drug verification</li>
                  <li>• Supply chain transparency</li>
                  <li>• Counterfeit prevention</li>
                  <li>• Regulatory compliance</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>MedChain Records</CardTitle>
                <CardDescription>
                  Secure, tokenized digital health record platform giving patients full ownership of their medical data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Patient-owned health records</li>
                  <li>• Secure data sharing</li>
                  <li>• Cross-hospital compatibility</li>
                  <li>• Privacy protection</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Coins className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>MedChain Wallet</CardTitle>
                <CardDescription>
                  Crypto-enabled wallet for seamless payments, insurance claims, and rewards in the healthcare
                  ecosystem.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Healthcare payments</li>
                  <li>• Insurance integration</li>
                  <li>• Reward tokens</li>
                  <li>• Multi-currency support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tokenomics */}
      <section id="tokenomics" className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/cryptocurrency-tokens-and-blockchain-network-visua.jpg"
            alt="Tokenomics background"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-muted/85"></div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">MCH Tokenomics</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sustainable token distribution designed for long-term ecosystem growth
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Token Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">IDO Investors (20%)</span>
                    <span className="text-sm font-medium">200M MCH</span>
                  </div>
                  <Progress value={20} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Founders (20%)</span>
                    <span className="text-sm font-medium">200M MCH</span>
                  </div>
                  <Progress value={20} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Treasury & Ecosystem (25%)</span>
                    <span className="text-sm font-medium">250M MCH</span>
                  </div>
                  <Progress value={25} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Team & Advisors (15%)</span>
                    <span className="text-sm font-medium">150M MCH</span>
                  </div>
                  <Progress value={15} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Partnerships (10%)</span>
                    <span className="text-sm font-medium">100M MCH</span>
                  </div>
                  <Progress value={10} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reserves (10%)</span>
                    <span className="text-sm font-medium">100M MCH</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Token Utility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Payment Method</p>
                      <p className="text-sm text-muted-foreground">Pay for healthcare services and medications</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Staking Rewards</p>
                      <p className="text-sm text-muted-foreground">Earn rewards for network participation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Governance Rights</p>
                      <p className="text-sm text-muted-foreground">Vote on platform improvements and policies</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Access Premium Features</p>
                      <p className="text-sm text-muted-foreground">Unlock advanced healthcare tools and services</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-primary">1B</div>
                    <div className="text-sm text-muted-foreground">Total Supply</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-primary">$0.0017</div>
                    <div className="text-sm text-muted-foreground">USD Price</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/african-continent-map-with-healthcare-icons-and-gr.jpg"
            alt="African healthcare market"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Market Opportunity</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Massive addressable market with significant growth potential across Africa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>₦5 Trillion</CardTitle>
                <CardDescription>Africa's pharmaceutical market size</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>₦50 Billion</CardTitle>
                <CardDescription>Revenue potential with 1% market share</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>1.3 Billion</CardTitle>
                <CardDescription>People across Africa needing healthcare</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/futuristic-blockchain-network-with-medical-cross-s.jpg" alt="Healthcare revolution" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/90"></div>
        </div>
        <div className="container mx-auto text-center relative z-10 text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Healthcare Revolution</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Be part of transforming African healthcare with blockchain technology. Secure your MCH tokens in our IDO
            today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Participate in IDO
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">MedChain</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Transforming African healthcare through blockchain innovation, ensuring transparency, authenticity, and
                universal access to quality medical care.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    MedChain Supply
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    MedChain Records
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    MedChain Wallet
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Whitepaper
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 MedChain HealthTech Limited. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
