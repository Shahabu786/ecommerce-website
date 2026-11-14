package com.example.ecomm.config;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.ecomm.model.Category;
import com.example.ecomm.model.Product;
import com.example.ecomm.repo.CategoryRepo;
import com.example.ecomm.repo.ProductRepo;

/**
 * Fills an EMPTY database with the storefront's demo categories and products,
 * so the frontend works (and can place real orders) right after the first start.
 * Set app.seed-demo-data=false in application.properties to turn this off.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final String[] CATEGORIES = {"Air Conditioners", "Refrigerators", "Televisions", "Mobile Phones", "Air Coolers", "Fans", "Washing Machines", "Laptops", "Audio", "Smartwatches", "Cameras", "Wearables"};

    // name, brand, category, price, old price ("" if none), description
    private static final String[][] PRODUCTS = {
        {"Samsung 1.5 Ton 5★ Inverter Split AC 2024 Wi-Fi", "SAMSUNG", "Air Conditioners", "34499", "62499", "Energy-efficient inverter cooling with smart Wi-Fi controls for comfortable everyday use."},
        {"LG 43” 4K UHD Smart TV with ThinQ AI & WebOS", "LG", "Televisions", "28999", "46999", "Enjoy 4K UHD picture quality, smart apps and ThinQ AI features."},
        {"OnePlus 12 5G 16GB+512GB Silky Black", "ONEPLUS", "Mobile Phones", "54999", "69999", "A premium 5G smartphone with generous memory and fast everyday performance."},
        {"Whirlpool 265L Double Door Frost-Free Refrigerator", "WHIRLPOOL", "Refrigerators", "24899", "34999", "Spacious frost-free refrigeration for keeping groceries fresh."},
        {"Symphony Diet 50i 50L Wi-Fi Desert Cooler + Remote", "SYMPHONY", "Air Coolers", "12499", "15999", "A desert air cooler with a large tank and convenient remote controls."},
        {"Crompton Aura Prime 1200mm BLDC Ceiling Fan + Remote", "CROMPTON", "Fans", "4299", "5990", "Efficient BLDC ceiling fan with remote control for everyday comfort."},
        {"Sony WH-1000XM5 Wireless Noise Cancelling Headphones", "SONY", "Audio", "24990", "38990", "Premium wireless headphones designed for immersive sound and noise cancellation."},
        {"Apple Watch Series 9 GPS 45mm Midnight Aluminium", "APPLE", "Smartwatches", "41900", "44900", "A smart wearable for activity tracking, notifications and everyday convenience."},
        {"LG 7kg 5★ Inverter Fully Auto Front Load Washing Machine", "LG", "Washing Machines", "28490", "47490", "A front-load washing machine designed for convenient and efficient laundry."},
        {"Canon EOS R50 Mirrorless Camera with 18-45mm Lens Kit", "CANON", "Cameras", "62495", "74995", "A compact mirrorless camera kit for photography and video creation."},
        {"Samsung Galaxy S24 Ultra 5G 12GB+256GB Titanium Black", "SAMSUNG", "Mobile Phones", "124999", "134999", "A premium Galaxy phone with a large display, advanced cameras and 5G connectivity."},
        {"Apple MacBook Air M3 13\" 8GB RAM 256GB SSD Midnight", "APPLE", "Laptops", "114900", "119900", "A lightweight laptop for work, study and everyday creative tasks."},
        {"Sony Bravia 55\" OLED 4K Ultra HD Smart Google TV", "SONY", "Televisions", "109990", "129990", "A large OLED 4K smart TV for detailed visuals and streaming entertainment."},
        {"Daikin 2 Ton 5★ Wi-Fi Inverter Split AC 2024 Model", "DAIKIN", "Air Conditioners", "49990", "56990", "A Wi-Fi-enabled inverter split AC for powerful and efficient cooling."},
        {"Wireless Headphones", "TECHNEST", "Audio", "1999", "2499", "Comfortable wireless headphones for music, calls and everyday listening."},
        {"Smart Watch", "TECHNEST", "Wearables", "2999", "3499", "Track activity and stay connected with a versatile smart watch."},
        {"Bluetooth Speaker", "TECHNEST", "Audio", "1499", "1999", "Portable sound for your home and outdoor activities."}
    };

    private final CategoryRepo categoryRepo;
    private final ProductRepo productRepo;

    @Value("${app.seed-demo-data:true}")
    private boolean seedEnabled;

    public DataSeeder(CategoryRepo categoryRepo, ProductRepo productRepo) {
        this.categoryRepo = categoryRepo;
        this.productRepo = productRepo;
    }

    @Override
    public void run(String... args) {
        if (!seedEnabled) {
            return;
        }
        if (categoryRepo.count() == 0) {
            for (String name : CATEGORIES) {
                Category category = new Category();
                category.setCategoryName(name);
                category.setDescription(name + " at TechNest");
                categoryRepo.save(category);
            }
        }
        if (productRepo.count() == 0) {
            Map<String, Category> byName = new HashMap<>();
            for (Category category : categoryRepo.findAll()) {
                byName.put(category.getCategoryName(), category);
            }
            for (String[] row : PRODUCTS) {
                Product product = new Product();
                product.setProductName(row[0]);
                product.setBrand(row[1]);
                product.setCategory(byName.get(row[2]));
                product.setPrice(new BigDecimal(row[3]));
                if (!row[4].isEmpty()) {
                    product.setOldPrice(new BigDecimal(row[4]));
                }
                product.setDescription(row[5]);
                product.setStockQuantity(50);
                productRepo.save(product);
            }
        }
    }
}
