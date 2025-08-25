from rest_framework import serializers
from .models import Usuario, Tarefa

class TarefaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarefa
        fields = "__all__"

class UsuarioSerializer(serializers.ModelSerializer):
    tarefas = TarefaSerializer(many=True, read_only=True)

    class Meta:
        model = Usuario
        fields = ["id", "nome", "email", "tarefas"]