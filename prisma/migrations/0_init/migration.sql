-- CreateTable
CREATE TABLE `Testing_mqtt` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `num` INTEGER NOT NULL,
    `create_Date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
