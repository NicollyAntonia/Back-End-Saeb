from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=100, null=False)
    email = models.EmailField(unique=True, null=False)

    def __str__(self):
        return self.nome

class Tarefa(models.Model):
    descricao = models.CharField(max_length=300, null=False)
    setor = models.CharField(max_length=250, null=False)
    prioridade = models.IntegerField()

    STATUS_CHOICES = [
        ('P', 'Pendente'),
        ('C', 'Concluída'),
        ('A', 'Arquivada'),
    ]
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, null=False, default='P')

    data_criacao = models.DateTimeField(auto_now_add=True, null=False)

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='tarefas')

    def __str__(self):
        return f"{self.descricao} - {self.get_status_display()}"
