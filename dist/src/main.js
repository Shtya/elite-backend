"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const QueryFailedErrorFilter_1 = require("../common/QueryFailedErrorFilter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(app.get(QueryFailedErrorFilter_1.QueryFailedErrorFilter));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', '..', '/uploads'), { prefix: '/uploads/' });
    app.enableCors({});
    app.useGlobalPipes(new common_1.ValidationPipe({ disableErrorMessages: false, transform: true, forbidNonWhitelisted: true, whitelist: true }));
    common_1.Logger.log(`🚀 server is running on port ${process.env.PORT || 3030}`);
    await app.listen(process.env.PORT || 3030);
}
bootstrap();
//# sourceMappingURL=main.js.map