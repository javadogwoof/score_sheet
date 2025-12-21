run:
	npm run build
	npx cap run ios --target 0AD03683-B70F-4F61-9B91-4A78DB251766
	npx cap run android --target Medium_Phone_API_36.0

run-ios:
	npm run build
	npx cap run ios --target 0AD03683-B70F-4F61-9B91-4A78DB251766

run-android:
	npm run build
	npx cap run android --target Medium_Phone_API_36.0
