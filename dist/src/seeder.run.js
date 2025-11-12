"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedMessageTemplates = exports.seedCMS = exports.seedNotifications = exports.seedCampaigns = exports.seedPayments = exports.seedReviews = exports.seedAppointments = exports.seedProperties = exports.seedPropertyTypes = exports.seedAreas = exports.seedCities = exports.seedAgents = exports.seedUsers = void 0;
const dotenv = require("dotenv");
dotenv.config();
const typeorm_1 = require("typeorm");
const global_entity_1 = require("./entities/global.entity");
const global_entity_2 = require("./entities/global.entity");
const global_entity_3 = require("./entities/global.entity");
const global_entity_4 = require("./entities/global.entity");
const global_entity_5 = require("./entities/global.entity");
const global_entity_6 = require("./entities/global.entity");
const global_entity_7 = require("./entities/global.entity");
const global_entity_8 = require("./entities/global.entity");
const global_entity_9 = require("./entities/global.entity");
const global_entity_10 = require("./entities/global.entity");
const global_entity_11 = require("./entities/global.entity");
const global_entity_12 = require("./entities/global.entity");
const global_entity_13 = require("./entities/global.entity");
const global_entity_14 = require("./entities/global.entity");
const global_entity_15 = require("./entities/global.entity");
const global_entity_16 = require("./entities/global.entity");
const global_entity_17 = require("./entities/global.entity");
const global_entity_18 = require("./entities/global.entity");
const global_entity_19 = require("./entities/global.entity");
const global_entity_20 = require("./entities/global.entity");
const global_entity_21 = require("./entities/global.entity");
const global_entity_22 = require("./entities/global.entity");
const global_entity_23 = require("./entities/global.entity");
const global_entity_24 = require("./entities/global.entity");
const global_entity_25 = require("./entities/global.entity");
const global_entity_26 = require("./entities/global.entity");
const bcrypt = require("bcryptjs");
const seedUsers = async (dataSource) => {
    const userRepository = dataSource.getRepository(global_entity_1.User);
    const users = [
        {
            phoneNumber: '+966500000001',
            email: 'admin@gmail.com',
            fullName: 'System Administrator',
            userType: global_entity_1.UserType.ADMIN,
            verificationStatus: global_entity_1.VerificationStatus.VERIFIED,
            isActive: true,
            verifiedAt: new Date(),
            password: '123456',
        },
        {
            phoneNumber: '+966500000002',
            email: 'agent@gmail.com',
            fullName: 'Ahmed Al-Saud',
            userType: global_entity_1.UserType.AGENT,
            verificationStatus: global_entity_1.VerificationStatus.VERIFIED,
            isActive: true,
            verifiedAt: new Date(),
            password: '123456',
        },
        {
            phoneNumber: '+966500000003',
            email: 'agent2@gmail.com',
            fullName: 'Mohammed Al-Rashid',
            userType: global_entity_1.UserType.AGENT,
            verificationStatus: global_entity_1.VerificationStatus.VERIFIED,
            isActive: true,
            verifiedAt: new Date(),
            password: '123456',
        },
        {
            phoneNumber: '+966500000004',
            email: 'customer@gmail.com',
            fullName: 'Customer One',
            userType: global_entity_1.UserType.CUSTOMER,
            verificationStatus: global_entity_1.VerificationStatus.VERIFIED,
            isActive: true,
            verifiedAt: new Date(),
            password: '123456',
        },
        {
            phoneNumber: '+966500000005',
            email: 'customer2@gmail.com',
            fullName: 'Customer Two',
            userType: global_entity_1.UserType.CUSTOMER,
            verificationStatus: global_entity_1.VerificationStatus.VERIFIED,
            isActive: true,
            verifiedAt: new Date(),
            password: '123456',
        },
        {
            phoneNumber: '+966500000006',
            email: 'marketer1@gmail.com',
            fullName: 'Marketing Specialist',
            userType: global_entity_1.UserType.MARKETER,
            verificationStatus: global_entity_1.VerificationStatus.VERIFIED,
            isActive: true,
            verifiedAt: new Date(),
            password: '123456',
        },
        {
            phoneNumber: '+966500000007',
            email: 'quality@gmail.com',
            fullName: 'Quality Team Member',
            userType: global_entity_1.UserType.QUALITY,
            verificationStatus: global_entity_1.VerificationStatus.VERIFIED,
            isActive: true,
            verifiedAt: new Date(),
            password: '123456',
        },
    ];
    const hashedUsers = await Promise.all(users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(user.password, salt);
        return {
            ...user,
            passwordHash,
        };
    }));
    const safeUsers = hashedUsers.map(({ password, ...rest }) => rest);
    await userRepository.save(safeUsers);
    console.log('✅ Seeded users successfully with encrypted passwords');
};
exports.seedUsers = seedUsers;
const seedAgents = async (dataSource) => {
    const agentRepository = dataSource.getRepository(global_entity_2.Agent);
    const userRepository = dataSource.getRepository(global_entity_1.User);
    const agents = await userRepository.find({ where: { userType: global_entity_1.UserType.AGENT } });
    const cities = await dataSource.getRepository(global_entity_3.City).find();
    const agentData = agents.map(async (agent, index) => ({
        user: agent,
        city: cities[index % cities.length],
        identityProofUrl: `https://example.com/agent${index + 1}_id.jpg`,
        residencyDocumentUrl: `https://example.com/agent${index + 1}_residency.jpg`,
        status: global_entity_2.AgentApprovalStatus.APPROVED,
        kycNotes: 'All documents verified successfully',
        updatedBy: await userRepository.findOne({ where: { userType: global_entity_1.UserType.ADMIN } }),
    }));
    await agentRepository.save(agentData);
    console.log('✅ Seeded agents successfully');
};
exports.seedAgents = seedAgents;
const seedCities = async (dataSource) => {
    const cityRepository = dataSource.getRepository(global_entity_3.City);
    const cities = [
        { name: 'الرياض', isActive: true },
        { name: 'جدة', isActive: true },
        { name: 'مكة المكرمة', isActive: true },
        { name: 'المدينة المنورة', isActive: true },
        { name: 'الدمام', isActive: true },
        { name: 'الخبر', isActive: true },
        { name: 'الطائف', isActive: true },
        { name: 'تبوك', isActive: true },
        { name: 'أبها', isActive: true },
        { name: 'حائل', isActive: true },
    ];
    await cityRepository.save(cities);
    console.log('✅ Seeded cities successfully');
};
exports.seedCities = seedCities;
const seedAreas = async (dataSource) => {
    const areaRepository = dataSource.getRepository(global_entity_4.Area);
    const cityRepository = dataSource.getRepository(global_entity_3.City);
    const cities = await cityRepository.find();
    const areas = [];
    cities.forEach(city => {
        const cityAreas = [
            { city, name: `${city.name} - المنطقة الشمالية`, isActive: true },
            { city, name: `${city.name} - المنطقة الجنوبية`, isActive: true },
            { city, name: `${city.name} - المنطقة الشرقية`, isActive: true },
            { city, name: `${city.name} - المنطقة الغربية`, isActive: true },
            { city, name: `${city.name} - المنطقة الوسطى`, isActive: true },
        ];
        areas.push(...cityAreas);
    });
    await areaRepository.save(areas);
    console.log('✅ Seeded areas successfully');
};
exports.seedAreas = seedAreas;
const seedPropertyTypes = async (dataSource) => {
    const propertyTypeRepository = dataSource.getRepository(global_entity_5.PropertyType);
    const propertyTypes = [
        { name: 'شقة', isActive: true },
        { name: 'فيلا', isActive: true },
        { name: 'منزل', isActive: true },
        { name: 'أرض', isActive: true },
        { name: 'مكتب', isActive: true },
        { name: 'محل تجاري', isActive: true },
        { name: 'مستودع', isActive: true },
        { name: 'مزرعة', isActive: true },
    ];
    await propertyTypeRepository.save(propertyTypes);
    console.log('✅ Seeded property types successfully');
};
exports.seedPropertyTypes = seedPropertyTypes;
const seedProperties = async (dataSource) => {
    const propertyRepository = dataSource.getRepository(global_entity_6.Property);
    const propertyMediaRepository = dataSource.getRepository(global_entity_7.PropertyMedia);
    const propertyTypeRepository = dataSource.getRepository(global_entity_5.PropertyType);
    const cityRepository = dataSource.getRepository(global_entity_3.City);
    const areaRepository = dataSource.getRepository(global_entity_4.Area);
    const userRepository = dataSource.getRepository(global_entity_1.User);
    const propertyTypes = await propertyTypeRepository.find();
    const cities = await cityRepository.find();
    const areas = await areaRepository.find({ where: { city: cities[0] } });
    const adminUser = await userRepository.findOne({ where: { userType: global_entity_1.UserType.ADMIN } });
    const properties = [
        {
            title: 'فيلا فاخرة في الرياض',
            description: 'فيلا فاخرة في حي العليا، 5 غرف نوم، 4 حمامات، مساحة 400 متر',
            propertyType: propertyTypes[1],
            city: cities[0],
            area: areas[0],
            bedrooms: 5,
            bathrooms: 4,
            areaM2: '400',
            price: '2500000',
            specifications: {
                furnished: true,
                parking: true,
                garden: true,
                pool: true,
            },
            guarantees: {
                warranty: '1 year',
                maintenance: 'included',
            },
            accessType: 'mediated',
            ownerName: 'علي أحمد',
            ownerPhone: '+966500000100',
            isActive: true,
            createdBy: adminUser,
        },
        {
            title: 'شقة جديدة في جدة',
            description: 'شقة جديدة في حي الصفا، 3 غرف نوم، 2 حمام، مطبخ أمريكي',
            propertyType: propertyTypes[0],
            city: cities[1],
            area: areas[1],
            bedrooms: 3,
            bathrooms: 2,
            areaM2: '150',
            price: '800000',
            specifications: {
                furnished: false,
                parking: true,
                elevator: true,
                security: true,
            },
            guarantees: {
                warranty: '6 months',
            },
            accessType: 'direct',
            isActive: true,
            createdBy: adminUser,
        },
        {
            title: 'أرض سكنية في الدمام',
            description: 'أرض سكنية في حي الخليج، مساحة 600 متر، موقع مميز',
            propertyType: propertyTypes[3],
            city: cities[4],
            area: areas[2],
            bedrooms: 0,
            bathrooms: 0,
            areaM2: '600',
            price: '1200000',
            specifications: {
                utilities: 'available',
                roadAccess: 'paved',
            },
            guarantees: {
                ownership: 'clear',
            },
            accessType: 'direct',
            isActive: true,
            createdBy: adminUser,
        },
    ];
    const savedProperties = await propertyRepository.save(properties);
    const mediaData = [];
    savedProperties.forEach((property, index) => {
        for (let i = 1; i <= 3; i++) {
            mediaData.push({
                property,
                mediaUrl: `https://example.com/property${index + 1}_image${i}.jpg`,
                isPrimary: i === 1,
                orderIndex: i,
            });
        }
    });
    await propertyMediaRepository.save(mediaData);
    console.log('✅ Seeded properties and media successfully');
};
exports.seedProperties = seedProperties;
const seedAppointments = async (dataSource) => {
    const appointmentRepository = dataSource.getRepository(global_entity_8.Appointment);
    const propertyRepository = dataSource.getRepository(global_entity_6.Property);
    const userRepository = dataSource.getRepository(global_entity_1.User);
    const agentRepository = dataSource.getRepository(global_entity_2.Agent);
    const properties = await propertyRepository.find();
    const customers = await userRepository.find({ where: { userType: global_entity_1.UserType.CUSTOMER } });
    const agents = await agentRepository.find({ relations: ['user'] });
    const appointments = [
        {
            property: properties[0],
            customer: customers[0],
            agent: agents[0].user,
            appointmentDate: '2024-02-15',
            startTime: '10:00',
            endTime: '11:00',
            status: global_entity_8.AppointmentStatus.CONFIRMED,
            customerNotes: 'مهتم برؤية الفيلا',
            createdChannel: global_entity_8.CreatedChannel.WEB,
        },
        {
            property: properties[1],
            customer: customers[1],
            agent: agents[1].user,
            appointmentDate: '2024-02-16',
            startTime: '14:00',
            endTime: '15:00',
            status: global_entity_8.AppointmentStatus.PENDING,
            customerNotes: 'أرغب في معاينة الشقة',
            createdChannel: global_entity_8.CreatedChannel.APP,
        },
        {
            property: properties[2],
            customer: customers[0],
            appointmentDate: '2024-02-17',
            startTime: '09:00',
            endTime: '10:00',
            status: global_entity_8.AppointmentStatus.PENDING,
            customerNotes: 'معاينة الأرض',
            createdChannel: global_entity_8.CreatedChannel.WEB,
        },
    ];
    await appointmentRepository.save(appointments);
    console.log('✅ Seeded appointments successfully');
};
exports.seedAppointments = seedAppointments;
const seedReviews = async (dataSource) => {
    const customerReviewRepository = dataSource.getRepository(global_entity_9.CustomerReview);
    const agentReviewRepository = dataSource.getRepository(global_entity_9.AgentReview);
    const appointmentRepository = dataSource.getRepository(global_entity_8.Appointment);
    const userRepository = dataSource.getRepository(global_entity_1.User);
    const appointments = await appointmentRepository.find({
        relations: ['customer', 'agent', 'property'],
    });
    const agents = await userRepository.find({ where: { userType: global_entity_1.UserType.AGENT } });
    const customerReviews = [
        {
            appointment: appointments[0],
            customer: appointments[0].customer,
            agentId: agents[0].id,
            rating: 5,
            reviewText: 'وكيل ممتاز ومحترف، شكراً جزيلاً',
            isApproved: true,
        },
        {
            appointment: appointments[1],
            customer: appointments[1].customer,
            agentId: agents[1].id,
            rating: 4,
            reviewText: 'خدمة جيدة، ولكن يمكن تحسين وقت الاستجابة',
            isApproved: true,
        },
    ];
    await customerReviewRepository.save(customerReviews);
    const agentReviews = [
        {
            appointment: appointments[0],
            agent: agents[0],
            customer: appointments[0].customer,
            rating: 5,
            reviewText: 'عميل محترم والتزم بالموعد',
        },
    ];
    await agentReviewRepository.save(agentReviews);
    console.log('✅ Seeded reviews successfully');
};
exports.seedReviews = seedReviews;
const seedPayments = async (dataSource) => {
    const paymentRepository = dataSource.getRepository(global_entity_10.AgentPayment);
    const balanceRepository = dataSource.getRepository(global_entity_11.AgentBalance);
    const appointmentRepository = dataSource.getRepository(global_entity_8.Appointment);
    const userRepository = dataSource.getRepository(global_entity_1.User);
    const agentRepository = dataSource.getRepository(global_entity_2.Agent);
    const appointments = await appointmentRepository.find({ relations: ['agent'] });
    const adminUser = await userRepository.findOne({ where: { userType: global_entity_1.UserType.ADMIN } });
    const agents = await agentRepository.find({ relations: ['user'] });
    const payments = [
        {
            appointment: appointments[0],
            agent: appointments[0].agent,
            amount: '500',
            status: global_entity_10.PaymentStatus.COMPLETED,
            gateway: global_entity_10.PaymentGateway.MANUAL,
            currency: 'SAR',
            paidAt: new Date(),
            updatedBy: adminUser,
        },
        {
            appointment: appointments[1],
            agent: appointments[1].agent,
            amount: '400',
            status: global_entity_10.PaymentStatus.PENDING,
            gateway: global_entity_10.PaymentGateway.MANUAL,
            currency: 'SAR',
            updatedBy: adminUser,
        },
    ];
    await paymentRepository.save(payments);
    const balanceData = agents.map(agent => ({
        agent: agent.user,
        totalEarnings: '500',
        pendingBalance: '400',
    }));
    await balanceRepository.save(balanceData);
    console.log('✅ Seeded payments and balances successfully');
};
exports.seedPayments = seedPayments;
const seedCampaigns = async (dataSource) => {
    const campaignRepository = dataSource.getRepository(global_entity_12.Campaign);
    const userRepository = dataSource.getRepository(global_entity_1.User);
    const adminUser = await userRepository.findOne({ where: { userType: global_entity_1.UserType.ADMIN } });
    const campaigns = [
        {
            name: 'ترويج الشتاء',
            title: 'عروض الشتاء الخاصة',
            description: 'عروض وتخفيضات خاصة لفصل الشتاء',
            targetChannel: global_entity_12.CampaignChannel.WHATSAPP,
            targetAudience: global_entity_12.CampaignAudience.CUSTOMERS,
            runType: global_entity_12.CampaignRunType.ONCE,
            runOnceDatetime: new Date('2024-12-01T10:00:00'),
            status: global_entity_12.CampaignStatus.SCHEDULED,
            messageContent: 'اكتشف عروضنا الخاصة لفصل الشتاء! خصومات تصل إلى 20% على مجموعة مختارة من العقارات.',
            createdBy: adminUser,
        },
        {
            name: 'ترحيب بالعملاء الجدد',
            title: 'مرحباً بكم في منصتنا',
            description: 'رسالة ترحيبية للعملاء الجدد',
            targetChannel: global_entity_12.CampaignChannel.WHATSAPP,
            targetAudience: global_entity_12.CampaignAudience.NEW_CUSTOMERS,
            runType: global_entity_12.CampaignRunType.RECURRING,
            runFrequency: 'daily',
            runTime: '09:00',
            status: global_entity_12.CampaignStatus.RUNNING,
            messageContent: 'مرحباً بك في منصتنا العقارية! نحن هنا لمساعدتك في العثور على العقار المثالي.',
            createdBy: adminUser,
        },
    ];
    await campaignRepository.save(campaigns);
    console.log('✅ Seeded campaigns successfully');
};
exports.seedCampaigns = seedCampaigns;
const seedNotifications = async (dataSource) => {
    const notificationRepository = dataSource.getRepository(global_entity_13.Notification);
    const userRepository = dataSource.getRepository(global_entity_1.User);
    const customers = await userRepository.find({ where: { userType: global_entity_1.UserType.CUSTOMER } });
    const notifications = [
        {
            user: customers[0],
            type: global_entity_13.NotificationType.APPOINTMENT_REMINDER,
            title: 'تذكير بالموعد',
            message: 'موعدك مجدول ليوم الغد الساعة 10:00 صباحاً',
            channel: global_entity_13.NotificationChannel.WHATSAPP,
            status: global_entity_13.NotificationStatus.DELIVERED,
            sentAt: new Date(),
        },
        {
            user: customers[1],
            type: global_entity_13.NotificationType.SYSTEM,
            title: 'مرحباً بك',
            message: 'شكراً لتسجيلك في منصتنا العقارية',
            channel: global_entity_13.NotificationChannel.IN_APP,
            status: global_entity_13.NotificationStatus.PENDING,
        },
    ];
    await notificationRepository.save(notifications);
    console.log('✅ Seeded notifications successfully');
};
exports.seedNotifications = seedNotifications;
const seedCMS = async (dataSource) => {
    const siteSettingsRepository = dataSource.getRepository(global_entity_14.SiteSettings);
    const footerSettingsRepository = dataSource.getRepository(global_entity_15.FooterSettings);
    const staticPageRepository = dataSource.getRepository(global_entity_16.StaticPage);
    const pageSectionRepository = dataSource.getRepository(global_entity_17.PageSection);
    const homeBackgroundRepository = dataSource.getRepository(global_entity_18.HomeBackground);
    const partnerLogoRepository = dataSource.getRepository(global_entity_19.PartnerLogo);
    const faqGroupRepository = dataSource.getRepository(global_entity_20.FaqGroup);
    const faqItemRepository = dataSource.getRepository(global_entity_21.FaqItem);
    const aboutFeatureRepository = dataSource.getRepository(global_entity_22.AboutFeature);
    const aboutStepRepository = dataSource.getRepository(global_entity_23.AboutStep);
    const aboutStatRepository = dataSource.getRepository(global_entity_24.AboutStat);
    const aboutTeamRepository = dataSource.getRepository(global_entity_25.AboutTeam);
    const userRepository = dataSource.getRepository(global_entity_1.User);
    const adminUser = await userRepository.findOne({ where: { userType: global_entity_1.UserType.ADMIN } });
    const siteSettings = siteSettingsRepository.create({
        introVideoUrl: 'https://example.com/intro.mp4',
        customerCount: 1500,
        yearsExperience: 5,
        projectCount: 300,
        email: 'info@realestate.com',
        phoneNumber: '+966112345678',
        twitterUrl: 'https://twitter.com/realestate',
        instagramUrl: 'https://instagram.com/realestate',
        updatedBy: adminUser,
    });
    await siteSettingsRepository.save(siteSettings);
    const footerSettings = footerSettingsRepository.create({
        footerParagraph: 'منصة عقارية رائدة تقدم أفضل الخدمات العقارية في المملكة العربية السعودية',
        newsletterTitle: 'اشترك في نشرتنا الإخبارية',
        newsletterParagraph: 'احصل على آخر العروض والتحديثات',
        updatedBy: adminUser,
    });
    await footerSettingsRepository.save(footerSettings);
    const staticPages = [
        { slug: global_entity_16.StaticPageSlug.MAIN, title: 'الصفحة الرئيسية', description: 'منصة عقارية متكاملة' },
        { slug: global_entity_16.StaticPageSlug.ABOUT, title: 'من نحن', description: 'تعرف على منصتنا العقارية' },
        { slug: global_entity_16.StaticPageSlug.TERMS, title: 'الشروط والأحكام', description: 'شروط استخدام المنصة' },
        { slug: global_entity_16.StaticPageSlug.PRIVACY, title: 'سياسة الخصوصية', description: 'سياسة الخصوصية والحماية' },
        { slug: global_entity_16.StaticPageSlug.FAQ, title: 'الأسئلة الشائعة', description: 'إجابات على الأسئلة المتكررة' },
    ];
    const savedStaticPages = await staticPageRepository.save(staticPages);
    const pageSections = [
        {
            page: savedStaticPages[0],
            sectionKey: global_entity_17.SectionKey.CATEGORIES,
            title: 'فئات العقارات',
            description: 'اكتشف مجموعة متنوعة من العقارات المناسبة لاحتياجاتك',
        },
        {
            page: savedStaticPages[0],
            sectionKey: global_entity_17.SectionKey.SERVICES,
            title: 'خدماتنا',
            description: 'نقدم مجموعة شاملة من الخدمات العقارية',
        },
    ];
    await pageSectionRepository.save(pageSections);
    const homeBackgrounds = [{ imageUrl: 'https://example.com/background1.jpg' }, { imageUrl: 'https://example.com/background2.jpg' }];
    await homeBackgroundRepository.save(homeBackgrounds);
    const partnerLogos = [
        { imageUrl: 'https://example.com/partner1.png', altText: 'شريك 1' },
        { imageUrl: 'https://example.com/partner2.png', altText: 'شريك 2' },
    ];
    await partnerLogoRepository.save(partnerLogos);
    const faqGroup = faqGroupRepository.create({
        title: 'أسئلة عامة',
    });
    const savedFaqGroup = await faqGroupRepository.save(faqGroup);
    const faqItems = [
        {
            group: savedFaqGroup,
            question: 'كيف يمكنني التسجيل في المنصة؟',
            answer: 'يمكنك التسجيل عن طريق رقم الهاتف والبريد الإلكتروني',
        },
        {
            group: savedFaqGroup,
            question: 'ما هي رسوم الخدمة؟',
            answer: 'نحن نعمل بدون رسوم على العملاء، الرسوم على المعلنين فقط',
        },
    ];
    await faqItemRepository.save(faqItems);
    const aboutFeatures = [{ featureText: 'عقارات متنوعة' }, { featureText: 'وكلاء موثوقون' }, { featureText: 'أسعار تنافسية' }];
    await aboutFeatureRepository.save(aboutFeatures);
    const aboutSteps = [
        { stepNumber: 1, title: 'اختر العقار', description: 'اختر من بين آلاف العقارات المناسبة' },
        { stepNumber: 2, title: 'حدد الموعد', description: 'حدد موعد المعاينة المناسب لك' },
        { stepNumber: 3, title: 'تملك العقار', description: 'استكمل إجراءات التملك بسهولة' },
    ];
    await aboutStepRepository.save(aboutSteps);
    const aboutStats = [
        { label: 'عملاء راضون', value: '1500+' },
        { label: 'عقار متاح', value: '500+' },
        { label: 'وكيل معتمد', value: '50+' },
    ];
    await aboutStatRepository.save(aboutStats);
    const aboutTeam = [
        { name: 'أحمد محمد', role: 'المدير التنفيذي', imageUrl: 'https://example.com/team1.jpg' },
        { name: 'سارة أحمد', role: 'مديرة التسويق', imageUrl: 'https://example.com/team2.jpg' },
    ];
    await aboutTeamRepository.save(aboutTeam);
    console.log('✅ Seeded CMS content successfully');
};
exports.seedCMS = seedCMS;
const seedMessageTemplates = async (dataSource) => {
    const messageTemplateRepository = dataSource.getRepository(global_entity_26.MessageTemplate);
    const messageTemplates = [
        {
            name: 'APPOINTMENT_REMINDER_AR',
            channel: global_entity_13.NotificationChannel.WHATSAPP,
            body: 'مرحباً {{customer_name}}، هذا تذكير بموعدك في {{appointment_date}} الساعة {{appointment_time}}',
            approved: true,
            locale: 'ar',
        },
        {
            name: 'APPOINTMENT_REMINDER_EN',
            channel: global_entity_13.NotificationChannel.WHATSAPP,
            body: 'Hello {{customer_name}}, this is a reminder for your appointment on {{appointment_date}} at {{appointment_time}}',
            approved: true,
            locale: 'en',
        },
        {
            name: 'WELCOME_MESSAGE_AR',
            channel: global_entity_13.NotificationChannel.WHATSAPP,
            body: 'مرحباً بك {{customer_name}} في منصتنا العقارية! شكراً لتسجيلك معنا.',
            approved: true,
            locale: 'ar',
        },
        {
            name: 'RATING_REQUEST_AR',
            channel: global_entity_13.NotificationChannel.WHATSAPP,
            body: 'مرحباً {{customer_name}}، نرجو تقييم تجربتك مع الوكيل {{agent_name}}',
            approved: true,
            locale: 'ar',
        },
    ];
    await messageTemplateRepository.save(messageTemplates);
    console.log('✅ Seeded message templates successfully');
};
exports.seedMessageTemplates = seedMessageTemplates;
async function runSeeder() {
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'password',
        database: process.env.DATABASE_NAME || 'real_estate',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
    });
    try {
        await dataSource.initialize();
        console.log('🚀 Starting database seeding...');
        const tables = await dataSource.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`);
        const tableNames = tables.map((t) => `"${t.tablename}"`).join(', ');
        await dataSource.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
        console.log('🗑️  Cleared existing data');
        await (0, exports.seedUsers)(dataSource);
        await (0, exports.seedCities)(dataSource);
        await (0, exports.seedAreas)(dataSource);
        await (0, exports.seedPropertyTypes)(dataSource);
        await (0, exports.seedAgents)(dataSource);
        await (0, exports.seedProperties)(dataSource);
        await (0, exports.seedAppointments)(dataSource);
        await (0, exports.seedReviews)(dataSource);
        await (0, exports.seedPayments)(dataSource);
        await (0, exports.seedCampaigns)(dataSource);
        await (0, exports.seedNotifications)(dataSource);
        await (0, exports.seedCMS)(dataSource);
        await (0, exports.seedMessageTemplates)(dataSource);
        console.log('🎉 All seeders completed successfully!');
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
    finally {
        await dataSource.destroy();
    }
}
runSeeder();
//# sourceMappingURL=seeder.run.js.map