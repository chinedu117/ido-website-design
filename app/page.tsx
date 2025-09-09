"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Zap,
  Globe,
  Users,
  TrendingUp,
  Lock,
  CheckCircle,
  ArrowRight,
  Coins,
  BarChart3,
  Wallet,
  Clock,
  ExternalLink,
} from "lucide-react"

// Import our real wallet context
import { useWallet } from "@/contexts/WalletContext"
import { ethers } from "ethers"
import { toast } from "sonner"
import { getIDOContract, getNairaTokenContract } from "@/lib/contracts"



// Mock transaction data
const mockTransactions = [
  { id: "0x1234", amount: "1000", status: "completed", timestamp: "2025-01-09 14:30", hash: "0x1234567890abcdef" },
  { id: "0x5678", amount: "500", status: "pending", timestamp: "2025-01-09 15:45", hash: "0x5678901234abcdef" },
  { id: "0x9abc", amount: "2000", status: "failed", timestamp: "2025-01-09 16:20", hash: "0x9abc567890123def" },
]

export default function MedChainIDO() {
  const { 
    isConnected, 
    account, 
    ethBalance, 
    connectWallet, 
    disconnectWallet, 
    nairaTokenBalance, 
    mchBalance,
    provider,
    refreshBalances,
  } = useWallet()

  const [purchaseAmount, setPurchaseAmount] = useState("")
  const [transactions, setTransactions] = useState(mockTransactions)
  
  console.log("Naira Token Balance:", nairaTokenBalance);
  console.log("Eth Token Balance:", ethBalance);
  const targetRaise = 500000000 // ₦500M
  const currentRaised = 185000000 // ₦185M raised so far
  const progressPercentage = (currentRaised / targetRaise) * 100
  const remainingAmount = targetRaise - currentRaised

  const handlePurchase = async () => {
    if (!purchaseAmount || !isConnected || !provider) return;

    const loadingToast = toast.loading('Processing purchase...');
    try {
      // Get contract instances
      const idoContract = getIDOContract(provider);
      const tokenContract = getNairaTokenContract(provider);
      
      // Convert purchase amount to wei
      const amountInWei = ethers.utils.parseEther(purchaseAmount);

      // First approve the IDO contract to spend tokens
      try {
        const approvalTx = await tokenContract.approve(
          process.env.NEXT_PUBLIC_IDO_CONTRACT_ADDRESS,
          amountInWei
        );
        await approvalTx.wait();
        toast.success('Approval successful!');
      } catch (error: any) {
        console.error('Approval error:', error);
        throw new Error('Failed to approve token spending');
      }

      // Now proceed with the purchase
      const tx = await idoContract.buy(amountInWei, {
        gasLimit: ethers.utils.hexlify(300000),
        maxFeePerGas: ethers.utils.parseUnits('50', 'gwei'),
        maxPriorityFeePerGas: ethers.utils.parseUnits('1.5', 'gwei'),
      });

      // Add transaction to state
      const newTransaction = {
        id: tx.hash,
        amount: purchaseAmount,
        status: "pending",
        timestamp: new Date().toLocaleString(),
        hash: tx.hash,
      };
      setTransactions(prev => [newTransaction, ...prev]);

      await tx.wait();
      
      setTransactions(prev => 
        prev.map(t => t.id === tx.hash ? {...t, status: "completed"} : t)
      );
      await refreshBalances();
      setPurchaseAmount("");
      
      toast.dismiss(loadingToast);
      toast.success('Purchase successful!');
      
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast.error(
        error.message === 'Failed to approve token spending'
          ? 'Failed to approve token spending'
          : 'Purchase failed'
      );
    } finally {
      toast.dismiss(loadingToast);
    }
  }



  // Add validation function
  const validatePurchase = (amount: string) => {
    const numAmount = Number(amount);
    const minPurchase = 100; // Minimum purchase amount in Naira
    const maxPurchase = 1000000; // Maximum purchase amount in Naira

    if (numAmount < minPurchase) {
      toast.error(`Minimum purchase amount is ₦${minPurchase}`);
      return false;
    }

    if (numAmount > maxPurchase) {
      toast.error(`Maximum purchase amount is ₦${maxPurchase}`);
      return false;
    }

    if (numAmount > Number(nairaTokenBalance)) {
      toast.error('Insufficient Naira balance');
      return false;
    }

    return true;
  };

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
            <a href="#ido" className="text-muted-foreground hover:text-foreground transition-colors">
              IDO
            </a>
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {account}
                </Badge>
                <Button variant="outline" size="sm" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connectWallet}>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
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

          <div className="mb-12 max-w-4xl mx-auto">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">IDO Fundraising Progress</h3>
                  <p className="text-muted-foreground">
                    Join thousands of investors backing Africa's healthcare revolution
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                      ₦{(currentRaised / 1000000).toFixed(0)}M
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">RAISED SO FAR</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-destructive mb-2">
                      ₦{(remainingAmount / 1000000).toFixed(0)}M
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">REMAINING</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">
                      {progressPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">COMPLETED</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span>₦{(currentRaised / 1000000).toFixed(0)}M raised</span>
                    <span>₦{(targetRaise / 1000000).toFixed(0)}M target</span>
                  </div>
                  <Progress value={progressPercentage} className="h-4 bg-muted" />
                  <div className="text-center text-sm text-muted-foreground">
                    <strong>{Math.round(progressPercentage)}% of target achieved</strong> •
                    <span className="text-primary font-medium">
                      {" "}
                      {((targetRaise - currentRaised) / 2.5 / 1000000).toFixed(1)}M MCH tokens remaining
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="text-lg px-8"
              onClick={() => document.getElementById("ido")?.scrollIntoView({ behavior: "smooth" })}
            >
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

      {/* IDO Purchase and Dashboard Section */}
      <section id="ido" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">IDO Dashboard</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Purchase MCH tokens and track your transactions
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="purchase" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="purchase">Purchase Tokens</TabsTrigger>
                <TabsTrigger value="transactions">Transaction History</TabsTrigger>
              </TabsList>

              <TabsContent value="purchase" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Purchase Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Coins className="w-5 h-5 mr-2" />
                        Buy MCH Tokens
                      </CardTitle>
                      <CardDescription>Purchase MedChain tokens at the IDO price of ₦2.50 per token</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!isConnected ? (
                        <div className="text-center py-8">
                          <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground mb-4">Connect your wallet to participate in the IDO</p>
                          <Button onClick={connectWallet}>
                            <Wallet className="w-4 h-4 mr-2" />
                            Connect Wallet
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="amount">Amount (₦)</Label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="Enter amount in Naira"
                              value={purchaseAmount}
                              onChange={(e) => setPurchaseAmount(e.target.value)}
                            />
                          </div>

                          {purchaseAmount && (
                            <div className="p-4 bg-muted rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted-foreground">You will receive:</span>
                                <span className="font-medium">
                                  {(Number.parseFloat(purchaseAmount) / 2.5).toLocaleString()} MCH
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Token price:</span>
                                <span className="font-medium">₦2.50 per MCH</span>
                              </div>
                            </div>
                          )}

                          <Button
                            className="w-full"
                            onClick={handlePurchase}
                            disabled={
                              !purchaseAmount || 
                              !isConnected || 
                              Number(purchaseAmount) <= 0 ||
                              !validatePurchase(purchaseAmount)
                            }
                          >
                            Purchase Tokens
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Wallet Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Wallet className="w-5 h-5 mr-2" />
                        Wallet Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isConnected ? (
                        <>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Wallet Address:</span>
                              <Badge variant="secondary" className="font-mono text-xs">
                                {account}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">ETH Balance:</span>
                              <span className="font-medium">{ethBalance} ETH</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Naira Balance:</span>
                              <span className="font-medium">N {nairaTokenBalance} </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">MCH Balance:</span>
                              <span className="font-medium">{mchBalance} MCH</span>
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-2">IDO Progress</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Raised</span>
                                <span>
                                  ₦{(currentRaised / 1000000).toFixed(0)}M / ₦{(targetRaise / 1000000).toFixed(0)}M
                                </span>
                              </div>
                              <Progress value={progressPercentage} className="h-2" />
                              <div className="text-xs text-muted-foreground text-center">
                                {progressPercentage.toFixed(1)}% of target reached
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>Connect wallet to view information</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Transaction History
                    </CardTitle>
                    <CardDescription>Track all your MCH token purchases and transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isConnected ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Connect wallet to view transaction history</p>
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No transactions yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {transactions.map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  tx.status === "completed"
                                    ? "bg-green-500"
                                    : tx.status === "pending"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                              />
                              <div>
                                <p className="font-medium">
                                  ₦{tx.amount} → {(Number.parseFloat(tx.amount) / 2.5).toLocaleString()} MCH
                                </p>
                                <p className="text-sm text-muted-foreground">{tx.timestamp}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  tx.status === "completed"
                                    ? "default"
                                    : tx.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {tx.status}
                              </Badge>
                              <Button variant="ghost" size="sm" asChild>
                                <a
                                  href={`https://etherscan.io/tx/${tx.hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/futuristic-blockchain-network-with-medical-cross-s.jpg"
            alt="Healthcare revolution"
            className="w-full h-full object-cover"
          />
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
