import Category from "../models/categoryModel.js";

export async function seedCategories() {
    // console.log("🌱 Kategori seed işlemi başlatılıyor...");

    const existingCount = await Category.count();

    if (existingCount > 0) {
        // console.log(`✅ Zaten ${existingCount} kategori mevcut. Seed işlemi atlanıyor.`);
        return;
    }

    const categories = [
        // Ana kateqoriyalar
        { id: 1, name: "Makiyaj", parentId: null },
        { id: 2, name: "Üzə qulluq", parentId: null },
        { id: 3, name: "Bədənə qulluq və vanna", parentId: null },
        { id: 4, name: "Saçlara qulluq", parentId: null },
        { id: 5, name: "Sağlamlıq və baxım", parentId: null },
        { id: 6, name: "Ətriyyat", parentId: null },
        { id: 7, name: "Uşaqlar üçün", parentId: null },
        { id: 8, name: "Kişilər üçün", parentId: null },
        { id: 9, name: "Ev və bağ üçün", parentId: null },
        { id: 10, name: "Geyim və aksesuarlar", parentId: null },
        { id: 11, name: "Dəstlər", parentId: null },

        // Alt kateqoriyalar - Makiyaj üçün
        { id: 100, name: "Gözlər üçün", parentId: 1 },
        { id: 101, name: "Dodaqlar üçün", parentId: 1 },
        { id: 102, name: "Üz üçün", parentId: 1 },
        { id: 103, name: "Dırnaqlar üçün", parentId: 1 },
        { id: 104, name: "Makiyajın silinməsi", parentId: 1 },
        { id: 105, name: "Makiyaj üçün aksesuarlar", parentId: 1 },
        { id: 106, name: "Makiyaj üçün dəstlər", parentId: 1 },

        // Alt kateqoriyalar - Üzə qulluq üçün
        { id: 200, name: "Nəmləndirmə və qulluq", parentId: 2 },
        { id: 201, name: "Göz ətrafi dərisi üçün qulluq", parentId: 2 },
        { id: 202, name: "Maskalar", parentId: 2 },
        { id: 203, name: "Üz üçün təmizləmə vasitələri", parentId: 2 },
        { id: 204, name: "Qaş və kirpik üçün qulluq vasitələri", parentId: 2 },
        { id: 205, name: "Dodaqlara qulluq", parentId: 2 },

        // Alt kateqoriyalar - Bədənə qulluq və vanna
        { id: 300, name: "Əllərə qulluq", parentId: 3 },
        { id: 301, name: "Ayaqlara qulluq", parentId: 3 },
        { id: 302, name: "Bədənə qulluq", parentId: 3 },
        { id: 303, name: "Vanna və duş üçün", parentId: 3 },
        { id: 304, name: "Təraş və depilyasiya", parentId: 3 },
        { id: 305, name: "Günəşdən qorunma", parentId: 3 },
        { id: 306, name: "Qulluq üçün dəstlər", parentId: 3 },

        // Alt kateqoriyalar - Saçlara qulluq
        { id: 400, name: "Şampunlar", parentId: 4 },
        { id: 401, name: "Saçlara qulluq vasitələri", parentId: 4 },
        { id: 402, name: "Saç düzümü üçün vasitələr", parentId: 4 },
        { id: 403, name: "Saç üçün boyalar", parentId: 4 },
        { id: 404, name: "Saç düzümü aksesuarları", parentId: 4 },

        // Alt kateqoriyalar - Sağlamlıq və baxım
        { id: 500, name: "Ağız boşluğuna qulluq", parentId: 5 },
        { id: 501, name: "Şəxsi gigiyena", parentId: 5 },

        // Alt kateqoriyalar - Ətriyyat
        { id: 600, name: "Qadın ətrləri", parentId: 6 },
        { id: 601, name: "Kişi ətrləri", parentId: 6 },
        { id: 602, name: "Ətir dəstləri", parentId: 6 },
        { id: 603, name: "Uşaq ətrləri", parentId: 6 },

        // Alt kateqoriyalar - Uşaqlar üçün
        { id: 700, name: "Uşaqlar üçün", parentId: 7 },

        // Alt kateqoriyalar - Kişilər üçün
        { id: 800, name: "Kişilər üçün", parentId: 8 },

        // Alt kateqoriyalar - Ev və bağ üçün
        { id: 900, name: "Bədənə qulluq və vanna", parentId: 9 },
        { id: 901, name: "Saçlara qulluq", parentId: 9 },
        { id: 902, name: "Sağlamlıq və baxım", parentId: 9 },
        { id: 903, name: "Baxım dəstləri və kosmetika", parentId: 9 },

        // Alt kateqoriyalar - Geyim və aksesuarlar
        { id: 1000, name: "Destlər", parentId: 10 },

        // Alt kateqoriyalar - Dəstlər
        { id: 1100, name: "Təraş vasitələri", parentId: 11 },
        { id: 1101, name: "Bığ və saqqal üçün vasitələr", parentId: 11 },
        { id: 1102, name: "Saçlara qulluq", parentId: 11 },
        { id: 1103, name: "Baxım vasitələri", parentId: 11 },
        { id: 1104, name: "Qadınlar üçün", parentId: 11 },
        { id: 1105, name: "Üz və bədən baxımı", parentId: 11 },
        { id: 1106, name: "Parfüm", parentId: 11 },

        // Alt-alt kateqoriyalar - Gözlər üçün
        { id: 10000, name: "Qaş qələmləri", parentId: 100 },
        { id: 10001, name: "Qaş kölgələri", parentId: 100 },
        { id: 10002, name: "Qaş fiksatorları", parentId: 100 },
        { id: 10003, name: "Göz üçün baza", parentId: 100 },
        { id: 10004, name: "Göz qələmləri", parentId: 100 },
        { id: 10005, name: "Göz laynerləri", parentId: 100 },
        { id: 10006, name: "Göz kölgələri", parentId: 100 },
        { id: 10007, name: "Kirpiklər üçün tuş", parentId: 100 },
        { id: 10008, name: "Qaşlar üçün tuş", parentId: 100 },

        // Alt-alt kateqoriyalar - Dodaqlar üçün
        { id: 10100, name: "Dodaq qələmləri", parentId: 101 },
        { id: 10101, name: "Maye dodaq boyaları", parentId: 101 },
        { id: 10102, name: "Dodaq boyaları", parentId: 101 },
        { id: 10103, name: "Dodaqlara qulluq", parentId: 101 },
        { id: 10104, name: "Dodaq üçün parıldadıcılar", parentId: 101 },

        // Alt-alt kateqoriyalar - Üz üçün
        { id: 10200, name: "Konsilerlər", parentId: 102 },
        { id: 10201, name: "BB və CC kremləri", parentId: 102 },
        { id: 10202, name: "Tonal kremləri", parentId: 102 },
        { id: 10203, name: "Korrektorlar", parentId: 102 },
        { id: 10204, name: "Konturing", parentId: 102 },
        { id: 10205, name: "Haylayterlər", parentId: 102 },
        { id: 10206, name: "Bronzerlər", parentId: 102 },
        { id: 10207, name: "Kirşanlar", parentId: 102 },
        { id: 10208, name: "Ənlik", parentId: 102 },
        { id: 10209, name: "Makiyaj üçün bazalar", parentId: 102 },
        { id: 10210, name: "Makiyaj üçün fiksatorlar", parentId: 102 },
        { id: 10211, name: "Makiyaj üçün palietlər", parentId: 102 },

        // Alt-alt kateqoriyalar - Nəmləndirmə və qulluq
        { id: 20000, name: "Üz üçün kremlər", parentId: 200 },
        { id: 20001, name: "Mistlər", parentId: 200 },
        { id: 20002, name: "Spreylər", parentId: 200 },
        { id: 20003, name: "Serumlar", parentId: 200 },
        { id: 20004, name: "Losyonlar", parentId: 200 },

        // Alt-alt kateqoriyalar - Göz ətrafi dərisi üçün qulluq
        { id: 20100, name: "Göz ətrafi dərisi üçün kremlər", parentId: 201 },
        { id: 20101, name: "Göz altı patçları", parentId: 201 },

        // Alt-alt kateqoriyalar - Maskalar
        { id: 20200, name: "Kəpuklər", parentId: 202 },
        { id: 20201, name: "Gellər", parentId: 202 },
        { id: 20202, name: "Miselyar su", parentId: 202 },
        { id: 20203, name: "Skrablar", parentId: 202 },
        { id: 20204, name: "Pilling", parentId: 202 },
        { id: 20205, name: "Tonerlər", parentId: 202 },
        { id: 20206, name: "Musslar və Toniklər", parentId: 202 },

        // Alt-alt kateqoriyalar - Əllərə qulluq
        { id: 30000, name: "Əl üçün kremlər", parentId: 300 },

        // Alt-alt kateqoriyalar - Ayaqlara qulluq
        { id: 30100, name: "Ayaq üçün kremlər", parentId: 301 },
        { id: 30101, name: "Ayaq üçün maskalar", parentId: 301 },
        { id: 30102, name: "Ayaq üçün dezodorantlar", parentId: 301 },

        // Alt-alt kateqoriyalar - Bədənə qulluq
        { id: 30200, name: "Bədən üçün kremlər", parentId: 302 },
        { id: 30201, name: "Bədən üçün süd", parentId: 302 },
        { id: 30202, name: "Bədən üçün skrablar", parentId: 302 },
        { id: 30203, name: "Bədən üçün yağlar", parentId: 302 },
        { id: 30204, name: "Bədən üçün losyonlar", parentId: 302 },
        { id: 30205, name: "Bədən üçün spreylər", parentId: 302 },
        { id: 30206, name: "Bədən üçün serum", parentId: 302 },
        { id: 30207, name: "Bədən üçün gellər", parentId: 302 },

        // Alt-alt kateqoriyalar - Vanna və duş üçün
        { id: 30300, name: "Duş gelləri", parentId: 303 },
        { id: 30301, name: "Vanna və duş üçün aksesuarlar", parentId: 303 },
        { id: 30302, name: "Maye sabunlar", parentId: 303 },
        { id: 30303, name: "Sabunlar", parentId: 303 },
        { id: 30304, name: "Vanna üçün yağlar", parentId: 303 },

        // Alt-alt kateqoriyalar - Ağız boşluğuna qulluq
        { id: 50000, name: "Diş macunları", parentId: 500 },
        { id: 50001, name: "Diş fırçaları", parentId: 500 },
        { id: 50002, name: "Diş sapları", parentId: 500 },
        { id: 50003, name: "Ağız yaxalayıcıları", parentId: 500 },
        { id: 50004, name: "Uşaq üçün diş fırçaları", parentId: 500 },

        // Alt-alt kateqoriyalar - Şəxsi gigiyena
        { id: 50100, name: "Dezodorantlar", parentId: 501 },
        { id: 50101, name: "Gigiyenik qadın bezləri", parentId: 501 },
        { id: 50102, name: "İntim gigiyena", parentId: 501 },

        // Alt-alt kateqoriyalar - Şampunlar
        { id: 40000, name: "Kondisionerlər və balzamlar", parentId: 400 },
        { id: 40001, name: "Saç üçün skrablar", parentId: 400 },
        { id: 40002, name: "Saç üçün maskalar", parentId: 400 },
        { id: 40003, name: "Saç üçün serumlar", parentId: 400 },
        { id: 40004, name: "Saç üçün spreylər və yağlar", parentId: 400 },

        // Alt-alt kateqoriyalar - Saç düzümü üçün vasitələr
        { id: 40200, name: "Saç üçün musslar və köpüklər", parentId: 402 },
        { id: 40201, name: "Saç üçün mum", parentId: 402 },
        { id: 40202, name: "Saç üçün gellər", parentId: 402 },

        // Alt-alt kateqoriyalar - Saç düzümü aksesuarları (boş saxlanıb)

        // Alt-alt kateqoriyalar - Təraş vasitələri
        { id: 110000, name: "Təraş üçün vasitələr", parentId: 1100 },
        { id: 110001, name: "Təraş sonrası vasitələr", parentId: 1100 },
        { id: 110002, name: "Təraş ülgücləri", parentId: 1100 },

        // Alt-alt kateqoriyalar - İstatistika vasitələri (boş saxlanıb)

        // Alt-alt kateqoriyalar - Destlər (boş saxlanıb)

        // Alt-alt kateqoriyalar - Bronzatlar və avtoqaralma
        { id: 30500, name: "Bronzatlar və avtoqaralma", parentId: 305 },
        { id: 30501, name: "Günəşdən qoruyucular", parentId: 305 }
    ];

    for (const categoryData of categories) {
        try {
            const existingCategory = await Category.findOne({
                where: { id: categoryData.id }
            });

            if (existingCategory) {
                console.log(`⚠️ ${categoryData.name} kategorisi zaten mevcut, atlanıyor`);
                continue;
            }
            await Category.create(categoryData);
        } catch (error) {

            if (error.name === 'SequelizeUniqueConstraintError') {
                console.log(`⚠️ ${categoryData.name} kategorisi zaten mevcut (slug duplicate), atlanıyor`);
                continue;
            }

            console.error('❌ Seed işlemi sırasında hata:', error);
            throw error;
        }
    }

    console.log('🎉 Kategori seed işlemi tamamlandı!');
    console.log('Seed data eklendi');
}

if (import.meta.url === process.argv[1] || process.argv[1].endsWith('seedCategories.js')) {
    seedCategories()
        .then(() => process.exit())
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}