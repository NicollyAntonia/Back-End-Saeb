from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, TarefaViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'tarefas', TarefaViewSet)

urlpatterns = router.urls