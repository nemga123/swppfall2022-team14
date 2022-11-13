from dataclasses import field
from email.policy import default
from django.forms import models
from rest_framework import serializers
from cocktail.models import Cocktail
import random


class CocktailListSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Cocktail
        fields = (
            "id",
            "name",
            "image",
            "rate",
            "tags",
            "type",
            "author_id",
        )

    def get_tags(self, obj):
        return [t.tag.content for t in obj.tags.all()]


class CocktailDetailSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Cocktail
        fields = (
            "id",
            "name",
            "image",
            "introduction",
            "recipe",
            "ABV",
            "price_per_glass",
            "rate",
            "tags",
            "type",
            'author_id',
            'created_at',
            'updated_at'
        )

    def get_tags(self, obj):
        return [t.tag.content for t in obj.tags.all()]


class CocktailPostSerializer(serializers.ModelSerializer):
    image = serializers.CharField(max_length=500, default="default_img.png")
    ABV = serializers.FloatField(default=random.uniform(10.0, 50.0))
    price_per_glass = serializers.FloatField(
        default=random.randint(10, 100)*1000)

    class Meta:
        model = Cocktail
        fields = (
            "name",
            "image",
            "introduction",
            "recipe",
            "ABV",
            "price_per_glass",
            "author_id",
            "type"
        )


class CocktailUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cocktail
        fields = (
            "name",
            "introduction",
            "recipe"
        )
