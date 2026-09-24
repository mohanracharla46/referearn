import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import {
  BookOpen,
  Share2,
  Copy,
  Check,
  Zap,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Users,
  Target,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Search,
  ExternalLink,
  Award,
  CheckCircle2,
  Phone,
  AlertCircle,
} from 'lucide-react';

export const UserGuide = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [copiedText, setCopiedText] = useState('');

  const mainReferralCode =
    user?.referral_code ||
    user?.referralCode ||
    `REF-${(user?.name || 'USER').toUpperCase().replace(/[^A-Z0-9]/g, '-')}-2026`;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://referitup.com';
  const mainReferralUrl = `${origin}/join?ref=${mainReferralCode}`;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    addToast({
      title: 'Copied to Clipboard',
      message: `${label} copied successfully.`,
      type: 'success',
    });
    setTimeout(() => setCopiedText(''), 2000);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const visualSteps = [
    {
      step: '01',
      title: 'Step 1: Claim Your Partner Account & Enter Details',
      description:
        'On the "Claim Your Partner Account" modal, enter your Full Name and valid Email/Mobile Phone Number, then tap "Save Details & Enter Portal".',
      badge: 'Partner Account Activation',
      badgeType: 'warning',
      image: '/guide/step1.png',
    },
    {
      step: '02',
      title: 'Step 2: Tap On "Create Your Twin"',
      description:
        'On the AI Digital Twin landing page, tap the prominent "Create your Twin" button.',
      badge: 'Product Landing Page',
      badgeType: 'info',
      image: '/guide/step2.png',
    },
    {
      step: '03',
      title: 'Step 3: Switch To Phone Number Option & Enter Mobile',
      description:
        'On the Get Started modal, switch to the "Phone" tab option, enter your phone number, and tap "Continue with phone". (Note: Login with Number is required for valid Referral).',
      badge: 'Note: Login with Number required for Refer',
      badgeType: 'warning',
      image: '/guide/step3.png',
    },
    {
      step: '04',
      title: 'Step 4: Enter The Verification Code',
      description:
        'Enter the 6-digit verification code sent to your mobile phone number and tap "Continue".',
      badge: 'Verification Code Step',
      badgeType: 'success',
      image: '/guide/step4.png',
    },
    {
      step: '05',
      title: 'Step 5: Enter Your Full Name & Tap Continue',
      description:
        'On the "Create your twin" step, enter your full name in the name input box and tap "Continue ->".',
      badge: 'Profile Setup',
      badgeType: 'default',
      image: '/guide/step5.png',
    },
    {
      step: '06',
      title: 'Step 6: Fill Profile Details & Tap On "Build My Twin"',
      description:
        'Enter as many details as you can (LinkedIn URL, Job Title, Instagram/Website) and tap "Build my twin". (Note: At least 1 detail must be entered to count as a valid Referral).',
      badge: 'CRITICAL: At least 1 detail required for valid Referral',
      badgeType: 'danger',
      image: '/guide/step6.png',
    },
    {
      step: '07',
      title: 'Step 7: Finalize Profile Onboarding & Confirm Twin Creation',
      description:
        'Verify your entered information and tap "Build my twin" to finish the candidate digital twin setup and complete referral qualification.',
      badge: 'Final Referral Qualification',
      badgeType: 'success',
      image: '/guide/step7.png',
    },
  ];

  const sampleMessages = [
    {
      title: 'General Invite Template',
      channel: 'WhatsApp & DM',
      text: `Hey! I'm using Referitup to earn recurring cash rewards by sharing top software products. Sign up using my referral link and get instant publisher access: ${mainReferralUrl}`,
    },
    {
      title: 'Professional Partner Promo',
      channel: 'LinkedIn & Email',
      text: `Join the Referitup affiliate network to start monetizing your traffic with high payout offers and instant payouts: ${mainReferralUrl}`,
    },
    {
      title: 'Quick Social Media Bio / Status',
      channel: 'Instagram & X (Twitter)',
      text: `Earn ₹10 per referral + ₹30 bonus after 7 referrals with Referitup! Sign up here: ${mainReferralUrl}`,
    },
  ];

  const faqs = [
    {
      q: 'How does referral link tracking work?',
      a: 'When someone clicks your referral link, Referitup attaches your unique referral code (e.g., ref=REF-NAME-2026) and stores a 60-day tracking cookie in their browser. If they register or complete their profile onboarding within 60 days, the referral is automatically credited to your account.',
    },
    {
      q: 'When do I get paid for a referral?',
      a: 'Referral rewards of ₹10 per user credit automatically as soon as the referred user signs up and enters their mobile number. The payout initially enters your Pending Balance for quick fraud verification and transfers to Available Balance.',
    },
    {
      q: 'What is the minimum withdrawal amount?',
      a: 'The minimum withdrawal threshold is ₹100. Once your Available Balance reaches ₹100, you can request an instant transfer via UPI (GPay/PhonePe/Paytm) or Direct Bank Transfer.',
    },
    {
      q: 'How do Active Sprint Target rewards work?',
      a: 'Sprint Targets are milestone challenges where reaching 7 successful referrals unlocks an instant ₹30.00 cash bonus payout on top of your standard ₹10 per referral commissions.',
    },
    {
      q: 'Can I share my referral link on WhatsApp and Social Media?',
      a: 'Yes! You can share your tracked links across WhatsApp, LinkedIn, X, Telegram, email newsletters, or your own blog website. You can use the copyable templates on this page for quick sharing.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Page Header */}
      <PageHeader
        title="Publisher User Guide"
        subtitle="Step-by-step visual documentation on how referral onboarding works, how to share promo links, and how to claim rewards."
      />

      {/* Hero Welcome Card */}
      <Card className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-indigo-950 text-white border-zinc-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              Official Visual User Guide
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Referitup Visual Step-by-Step Onboarding Guide
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Below is the step-by-step visual process showing how referred users complete their profile setup so your referral is counted as valid and credited to your balance.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              onClick={() => navigate('/app/refer')}
              icon={Share2}
              className="bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-xs py-2.5 shadow-md"
            >
              Go to Refer & Earn
            </Button>
            <a
              href="#visual-steps"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold border border-zinc-700 transition"
            >
              <span>View Visual Steps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </Card>

      {/* Visual Step-by-Step Screenshot Walkthrough */}
      <div id="visual-steps" className="space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Visual Onboarding Workflow (7 Steps)
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Follow these exact screen steps to ensure your referred user completes onboarding so your referral is counted as valid.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {visualSteps.map((stepItem, idx) => (
            <Card key={idx} className="p-6 bg-white border-zinc-200 shadow-xs space-y-4 hover:border-zinc-400 transition-subtle">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-zinc-950 text-white font-mono font-extrabold flex items-center justify-center text-sm shadow-xs">
                    {stepItem.step}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-zinc-950">
                      {stepItem.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                      {stepItem.description}
                    </p>
                  </div>
                </div>

                <Badge variant={stepItem.badgeType} dot>
                  {stepItem.badge}
                </Badge>
              </div>

              {/* Centered High-Resolution Image Container */}
              <div className="flex justify-center bg-zinc-50/90 p-4 sm:p-6 rounded-xl border border-zinc-200/90 shadow-2xs">
                <img
                  src={stepItem.image}
                  alt={stepItem.title}
                  className="max-h-[480px] w-auto object-contain rounded-lg border border-zinc-300/80 shadow-md transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Copyable Promotional Templates Section */}
      <div id="templates" className="space-y-4 pt-4 border-t border-zinc-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              Ready-to-Use Promo Message Templates
            </h2>
            <p className="text-xs text-zinc-500">
              Copy any pre-written text below to share directly with your audience on WhatsApp, Telegram, or LinkedIn.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleMessages.map((msg, idx) => (
            <Card key={idx} className="p-5 bg-white border-zinc-200 flex flex-col justify-between space-y-4 shadow-2xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{msg.channel}</Badge>
                  <span className="text-[11px] font-mono text-zinc-400 font-semibold">Template #{idx + 1}</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-950">{msg.title}</h3>
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-700 leading-relaxed">
                  {msg.text}
                </div>
              </div>

              <Button
                variant={copiedText === `Template ${idx + 1}` ? 'success' : 'outline'}
                size="sm"
                onClick={() => copyToClipboard(msg.text, `Template ${idx + 1}`)}
                icon={copiedText === `Template ${idx + 1}` ? Check : Copy}
                className="w-full text-xs font-semibold cursor-pointer"
              >
                {copiedText === `Template ${idx + 1}` ? 'Copied to Clipboard' : 'Copy Message Text'}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Section */}
      <div className="space-y-4 pt-4 border-t border-zinc-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs text-zinc-500">
              Find answers to common questions about tracking, payout rules, and sprint targets.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder="Search guide FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredFaqs.length === 0 ? (
            <Card className="p-8 text-center text-zinc-500 text-xs">
              No FAQ results matching "{searchQuery}". Try searching with another keyword.
            </Card>
          ) : (
            filteredFaqs.map((faq, i) => (
              <Card
                key={i}
                className="border-zinc-200 bg-white overflow-hidden transition-subtle cursor-pointer"
                onClick={() => toggleFaq(i)}
              >
                <div className="p-4 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-mono">Q{i + 1}.</span>
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                  )}
                </div>
                {openFaq === i && (
                  <div className="px-4 pb-4 pt-1 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 bg-zinc-50/50">
                    {faq.a}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Footer Support Banner */}
      <Card className="bg-zinc-950 text-white p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 border-zinc-800 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Customer Support Helpline
          </h3>
          <p className="text-xs text-zinc-300 font-mono">
            Direct Helpline: <span className="font-bold text-emerald-400">+91 91604 42966</span> (24/7 Phone & WhatsApp Assistance)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/919160442966"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-subtle flex items-center gap-1.5 shadow-md"
          >
            <span>Chat on WhatsApp</span>
          </a>
          <Button
            variant="outline"
            onClick={() => navigate('/app/refer')}
            className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 text-xs font-bold"
          >
            Return to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UserGuide;
