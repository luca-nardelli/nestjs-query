#! /bin/sh

for pkg in packages/* ;do
	echo $pkg;
	(cd $pkg && npm pack);
done
mkdir -p release
rm -rf release/*
mv packages/*/*.tgz release/
